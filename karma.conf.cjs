const { esbuildPluginIstanbul } = require('esbuild-plugin-istanbul');

module.exports = function configureKarma(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'tests/karma/**/*.spec.js'
    ],
    preprocessors: {
      'tests/karma/**/*.spec.js': ['esbuild']
    },
    esbuild: {
      target: 'es2020',
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: {
        '.js': 'jsx'
      },
      singleBundle: true,
      plugins: [
        esbuildPluginIstanbul({
          filter: /src[\\/].*\.(js|jsx)$/,
          loader: 'jsx',
          name: 'istanbul-source'
        })
      ],
      sourcemap: 'inline'
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/karma',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },
    browsers: ['jsdom'],
    singleRun: true,
    autoWatch: false,
    client: {
      jasmine: {
        random: false
      }
    },
    plugins: [
      'karma-jasmine',
      'karma-jsdom-launcher',
      'karma-coverage',
      require('karma-esbuild')
    ]
  });
};
