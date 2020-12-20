import { load } from 'fengari-web';
import { EventEmitter } from 'events';

export const Loader = new EventEmitter();

export function loadCore() {
  load(`package.path = "/api/lua/?.lua;" .. package.path`)();

  // add deprecated function
  // math.pow is deprecated in 5.3 but factorio uses it.
  load(`\
    function pow(a, b) return a^b end
    math.pow = pow`)();

  // load presets
  load(`require "defines"`)();
  Loader.emit('@frc/loadCore/progress', 'dataLoader');
  load(`require "dataloader"`)();

  // load data
  Loader.emit('@frc/loadCore/progress', 'core');
  load(`require "core.data"`)();
  Loader.emit('@frc/loadCore/progress', 'base');
  load(`require "base.data"`)();

  Loader.emit('@frc/loadCore/progress', 'transform');
  const transformScript = `
    function toObject(o)
      local object = js.new(js.global.Object)
      for key, value in pairs(o) do
        if type(value) == "table" then
          object[key] = toObject(value)
        end
        if type(value) ~= "table" then
          object[key] = value
        end
      end
      return object
    end
    return toObject(data.raw)
  `;
  return load(transformScript)();
}

export function loadMod() {
  return {};
}
