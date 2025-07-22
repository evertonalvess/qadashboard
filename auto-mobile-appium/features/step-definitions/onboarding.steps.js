const { Given, Then } = require('@wdio/cucumber-framework');
const mainPage = require('../pageobjects/main.page');

Given('o aplicativo e iniciado', async () => {
  // App is launched by default via capabilities
});

Then('o titulo da tela inicial deve ser exibido', async () => {
  await expect(mainPage.title).toBeDisplayed();
});
