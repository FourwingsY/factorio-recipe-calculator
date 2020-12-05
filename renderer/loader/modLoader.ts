import { load } from 'fengari-web';

async function loadBase() {
  load(`package.path = "/api/lua/?.lua;" .. package.path`)();

  // add deprecated function
  load(`\
    function pow(a, b) return a^b end
    math.pow = pow`)();

  // load presets
  load(`require "defines"`)();
  load(`require "dataloader"`)();
  // load data

  load(`require "core.data"`)();
  load(`require "base.data"`)();
}

export default { loadBase };
