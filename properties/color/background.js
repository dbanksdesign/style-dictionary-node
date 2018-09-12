const core = require('./core');

const background = {
  base: core.white,
  alt: core.grey["10"],
}

// Bypassing Style Dictionary's reference resolution completely.
// This works:
background.disabled = background.alt;
background.low_priority = background.disabled;
// The only issue is that because you are bypassing the reference
// resolution, you no longer get the 'original', un-resolved value
// You would still have to do it the old way if you want to see
// the original reference in output files:
background.test = { value: "{color.background.disabled.value}" }

module.exports = background;