const StyleDictionary = require('style-dictionary');
const properties = require('./properties');

const buildPath = 'dist/';

module.exports = {
  properties: properties,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: buildPath,
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      // },{
        // Inline format functions don't work yet:
        //
        // destination: 'test.json',
        // format: function(dictionary) {
        //   return JSON.stringify( dictionary.properties, null, 2 );
        // }
      }]
    },

    scss: {
      // This works, we can create new transform arrays on the fly and edit built-ins
      transforms: StyleDictionary.transformGroup.scss.concat('color/rgb'),
      buildPath: buildPath,
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables'
      }]
    },

    js: {
      transformGroup: 'js',
      buildPath: buildPath,
      // Holy fuck this works:
      files: Object.keys(properties.color).map((colorType) => ({
        destination: `${colorType}.js`,
        format: 'javascript/es6',
        filter: (prop) => prop.attributes.type === colorType
      }))
    },

    json: {
      transformGroup: 'js',
      buildPath: buildPath,
      files: [{
        destination: 'properties.json',
        format: 'json'
      }]
    }
  }
}