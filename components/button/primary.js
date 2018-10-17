const base = require('./base');

module.exports = Object.assign({}, base, {
  'background-color': { value: '{color.background.link.value}' },
  'color': { value: '{color.font.inverse.base.value}' },
});