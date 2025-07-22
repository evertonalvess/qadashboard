const { Before, After } = require('@wdio/cucumber-framework');

Before(async () => {
  // Placeholder for actions before each scenario
});

After(async function (scenario) {
  // Capture screenshot on failure
  if (scenario.result?.status !== 0) {
    await driver.takeScreenshot();
  }
});
