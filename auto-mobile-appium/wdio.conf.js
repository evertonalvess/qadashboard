require('dotenv').config();
exports.config = {
  runner: 'local',
  specs: [
    './features/**/*.feature'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Pixel_5_API_30',
    'appium:platformVersion': process.env.ANDROID_VERSION || '11.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': process.env.APK_PATH,
    'appium:autoGrantPermissions': true
  }],
  logLevel: 'info',
  framework: 'cucumber',
  cucumberOpts: {
    require: ['./features/step-definitions/*.js', './features/support/*.js'],
    timeout: 60000
  },
  reporters: [
    'spec',
    ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }]
  ],
  services: ['appium'],
  appium: {
    command: 'appium'
  },
  before: async function () {
    await driver.setTimeout({ implicit: 5000 });
  },
  afterStep: async function (test, context, { error }) {
    if (error) {
      await driver.takeScreenshot();
    }
  }
};
