module.exports = function (config) {
  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // Frameworks to use
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["qunit", "ui5"],

    // List of files / patterns to load in the browser
    files: [
      // UI5 bootstrap and test files will be handled by karma-ui5
    ],

    // UI5 specific configuration
    ui5: {
      type: "application",
      configPath: "ui5.yaml",
      paths: {
        webapp: "webapp"
      },
      url: "/base",
      mode: "script"
    },

    // Test results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // How many browser will be started simultaneously
    concurrency: Infinity,

    // Browser configuration
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--remote-debugging-port=9222"
        ]
      }
    },

    // Client configuration
    client: {
      clearContext: false, // Leave Jasmine Spec Runner output visible in browser
      qunit: {
        showUI: true,
        testTimeout: 5000
      }
    }
  });
};