const StyleDictionary = require('style-dictionary');
const _ = require('lodash');
const properties = require('./properties');

const buildPath = 'build/';

// I don't know how this works, but apparently you can
// add custom transforms and formats like you normally would
// and reference them in the config below.
StyleDictionary.registerTransform({
  name: 'test',
  type: 'name',
  transformer: function(prop) {
    return prop.path.splice(2).join(' ')
  }
});

module.exports = {
  source: ['properties/index.js', 'components/index.js'],
  // If you don't want to call the registerTransform method a bunch of times
  // you can just override the whole transform object. This works because
  // in the .extend method, it actually copies everything in the config
  // to itself, so you can override things. It's also doing a deep merge
  // so you don't have to worry about using Object.assign to not accidentally
  // null out things.
  transform: {
    'customTransform': {
      type: 'value',
      transformer: (prop) => 'hello'
    }
  },
  // Same with formats, you can now just write them directly to this config
  // object. The name of the format is the key.
  format: {
    myFormat: (dictionary, platform) => {
      return dictionary.allProperties.map(prop => `${prop.name}: ${prop.value}`).join('\n');
    }
  },
  // You can also bypass the
  // merging of files Style Dictionary does by adding a 'properties' object
  // directly like this:
  //
  // properties: properties,
  platforms: {
    custom: {
      transforms: ['customTransform', 'test'],
      buildPath: buildPath,
      files: [{
        destination: 'variables.txt',
        format: 'myFormat'
      }]
    },
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
      transforms: StyleDictionary.transformGroup.js.concat('test'),
      buildPath: buildPath,
      // Holy fuck this works:
      files: Object.keys(properties.color).map((colorType) => ({
        destination: `${colorType}.js`,
        format: 'javascript/es6',
        filter: (prop) => prop.attributes.type === colorType
      }))
    },

    // componentJs: {
    //   transformGroup: 'js',
    //   buildPath: buildPath,
    //   // Holy fuck this works:
    //   files: Object.keys(properties.component).map((componentName) => ({
    //     destination: `${componentName}.js`,
    //     format: 'javascript/es6',
    //     filter: (prop) => prop.attributes.type === componentName
    //   }))
    // },

    json: {
      transformGroup: 'js',
      buildPath: buildPath,
      files: [{
        destination: 'properties.json',
        format: 'json'
      },{
        destination: 'index.html',
        template: 'static-style-guide/index.html'
      }]
    }
  }
}