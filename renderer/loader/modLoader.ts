import { load } from 'fengari-web';

function loadBase() {
  load(`package.path = "/api/lua/?.lua;" .. package.path`)();

  // add deprecated function
  // math.pow is deprecated in 5.3 but factorio uses it.
  load(`\
    function pow(a, b) return a^b end
    math.pow = pow`)();

  // load presets
  load(`require "defines"`)();
  load(`require "dataloader"`)();

  // load data
  load(`require "core.data"`)();
  load(`require "base.data"`)();

  const transformScript = `
    local categoryMap = {}
    for category, items in pairs(data.raw) do
      local itemMap = {}
      for itemType, item in pairs(items) do
        itemMap[itemType] = js.createproxy(item)
      end
      categoryMap[category] = js.createproxy(itemMap)
    end
    return js.createproxy(categoryMap)
  `;
  return load(transformScript)();
}

export default { loadBase };
