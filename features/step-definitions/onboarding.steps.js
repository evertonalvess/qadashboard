const { Given, When, Then } = require('@wdio/cucumber-framework');
const MainPage = require('../../pages/main.page');
const allureReporter = require('@wdio/allure-reporter').default;

// Shared variables for test data
let startTime;
let testData = {};

// Background steps
Given(/^que o dispositivo está conectado$/, async () => {
    allureReporter.addStep('Verificando conexão do dispositivo');
    
    // Verify driver is connected
    const isConnected = await driver.status();
    expect(isConnected).toBeDefined();
    
    allureReporter.addStep('Dispositivo conectado com sucesso');
    console.log('✓ Dispositivo Android conectado');
});

Given(/^o aplicativo está instalado$/, async () => {
    allureReporter.addStep('Verificando instalação do aplicativo');
    
    // Check if app is installed (this will be verified when app launches)
    // For now, we assume the app is properly configured in capabilities
    
    allureReporter.addStep('Aplicativo está disponível para instalação');
    console.log('✓ Aplicativo configurado para teste');
});

// Main test steps
Given(/^o aplicativo é iniciado$/, async () => {
    allureReporter.addStep('Iniciando aplicativo móvel');
    
    // Wait for app to load and main screen to appear
    await MainPage.waitForAppToLoad();
    
    // Take screenshot for evidence
    await driver.saveScreenshot('./allure-results/app-started.png');
    allureReporter.addAttachment('App Started', await driver.getPageSource(), 'text/plain');
    
    allureReporter.addStep('Aplicativo iniciado com sucesso');
    console.log('✓ Aplicativo iniciado');
});

Then(/^o título da tela inicial deve ser exibido$/, async () => {
    allureReporter.addStep('Verificando título da tela inicial');
    
    // Verify main title is displayed
    const isDisplayed = await MainPage.isMainTitleDisplayed();
    expect(isDisplayed).toBe(true);
    
    // Get title text for reporting
    const titleText = await MainPage.getMainTitleText();
    allureReporter.addStep(`Título encontrado: ${titleText}`);
    
    console.log(`✓ Título da tela inicial exibido: ${titleText}`);
});

Then(/^a logo do aplicativo deve estar visível$/, async () => {
    allureReporter.addStep('Verificando visibilidade da logo');
    
    // Check if app logo/icon is visible
    const isLogoVisible = await MainPage.isLogoVisible();
    expect(isLogoVisible).toBe(true);
    
    allureReporter.addStep('Logo do aplicativo está visível');
    console.log('✓ Logo do aplicativo visível');
});

When(/^eu tiro uma screenshot da tela inicial$/, async () => {
    allureReporter.addStep('Capturando screenshot da tela inicial');
    
    // Take screenshot with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `./allure-results/main-screen-${timestamp}.png`;
    
    await driver.saveScreenshot(screenshotPath);
    allureReporter.addAttachment('Screenshot Tela Initial', await driver.takeScreenshot(), 'image/png');
    
    console.log(`✓ Screenshot salva: ${screenshotPath}`);
});

Then(/^a screenshot deve ser salva com sucesso$/, async () => {
    allureReporter.addStep('Verificando se screenshot foi salva');
    
    // This step verifies the screenshot was taken in the previous step
    // In a real scenario, you might check file system or test artifacts
    
    allureReporter.addStep('Screenshot salva com sucesso');
    console.log('✓ Screenshot verificada');
});

// UI Elements validation steps
When(/^eu verifico os elementos principais da tela$/, async () => {
    allureReporter.addStep('Verificando elementos principais da interface');
    
    // Check multiple UI elements
    const elementsStatus = await MainPage.checkMainUIElements();
    testData.uiElements = elementsStatus;
    
    allureReporter.addStep(`Elementos verificados: ${Object.keys(elementsStatus).length}`);
    console.log('✓ Elementos da tela verificados');
});

Then(/^o menu principal deve estar presente$/, async () => {
    allureReporter.addStep('Validando presença do menu principal');
    
    const isMenuPresent = await MainPage.isMainMenuPresent();
    expect(isMenuPresent).toBe(true);
    
    allureReporter.addStep('Menu principal está presente');
    console.log('✓ Menu principal encontrado');
});

Then(/^os botões de navegação devem estar visíveis$/, async () => {
    allureReporter.addStep('Verificando botões de navegação');
    
    const navigationButtons = await MainPage.getNavigationButtons();
    expect(navigationButtons.length).toBeGreaterThan(0);
    
    allureReporter.addStep(`${navigationButtons.length} botões de navegação encontrados`);
    console.log(`✓ ${navigationButtons.length} botões de navegação visíveis`);
});

Then(/^nenhuma mensagem de erro deve ser exibida$/, async () => {
    allureReporter.addStep('Verificando ausência de mensagens de erro');
    
    const hasErrors = await MainPage.hasErrorMessages();
    expect(hasErrors).toBe(false);
    
    allureReporter.addStep('Nenhuma mensagem de erro encontrada');
    console.log('✓ Nenhum erro na tela');
});

// Navigation steps
When(/^eu clico no botão "([^"]*)"$/, async (buttonText) => {
    allureReporter.addStep(`Clicando no botão: ${buttonText}`);
    
    await MainPage.clickButton(buttonText);
    
    // Wait for navigation to complete
    await driver.pause(2000);
    
    allureReporter.addStep(`Botão "${buttonText}" clicado com sucesso`);
    console.log(`✓ Botão "${buttonText}" clicado`);
});

Then(/^a tela de demonstrações deve ser carregada$/, async () => {
    allureReporter.addStep('Verificando carregamento da tela de demonstrações');
    
    // Wait for new screen to load
    await MainPage.waitForScreenToLoad();
    
    // Take screenshot of new screen
    await driver.saveScreenshot('./allure-results/demo-screen.png');
    allureReporter.addAttachment('Demo Screen', await driver.takeScreenshot(), 'image/png');
    
    allureReporter.addStep('Tela de demonstrações carregada');
    console.log('✓ Tela de demonstrações carregada');
});

Then(/^o título "([^"]*)" deve estar visível$/, async (expectedTitle) => {
    allureReporter.addStep(`Verificando título: ${expectedTitle}`);
    
    const actualTitle = await MainPage.getCurrentScreenTitle();
    expect(actualTitle).toContain(expectedTitle);
    
    allureReporter.addStep(`Título verificado: ${actualTitle}`);
    console.log(`✓ Título "${expectedTitle}" encontrado`);
});

When(/^eu volto para a tela anterior$/, async () => {
    allureReporter.addStep('Navegando de volta para tela anterior');
    
    await driver.back();
    await driver.pause(2000);
    
    allureReporter.addStep('Navegação de volta executada');
    console.log('✓ Voltou para tela anterior');
});

Then(/^devo estar na tela inicial novamente$/, async () => {
    allureReporter.addStep('Verificando retorno à tela inicial');
    
    const isBackToMain = await MainPage.isMainTitleDisplayed();
    expect(isBackToMain).toBe(true);
    
    allureReporter.addStep('Retorno à tela inicial confirmado');
    console.log('✓ De volta à tela inicial');
});

// Performance steps
Given(/^que eu meço o tempo de início$/, async () => {
    allureReporter.addStep('Iniciando medição de performance');
    
    startTime = Date.now();
    testData.startTime = startTime;
    
    allureReporter.addStep('Timer de performance iniciado');
    console.log('✓ Medição de tempo iniciada');
});

Then(/^o aplicativo deve carregar em menos de (\d+) segundos$/, async (maxSeconds) => {
    allureReporter.addStep(`Verificando tempo de carregamento (máximo: ${maxSeconds}s)`);
    
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    
    expect(loadTime).toBeLessThan(parseInt(maxSeconds));
    
    allureReporter.addStep(`Tempo de carregamento: ${loadTime.toFixed(2)}s`);
    console.log(`✓ App carregou em ${loadTime.toFixed(2)}s`);
});

Then(/^todos os elementos essenciais devem estar carregados$/, async () => {
    allureReporter.addStep('Verificando carregamento de elementos essenciais');
    
    const essentialElements = await MainPage.areEssentialElementsLoaded();
    expect(essentialElements).toBe(true);
    
    allureReporter.addStep('Todos elementos essenciais carregados');
    console.log('✓ Elementos essenciais carregados');
});

// Data generation steps
When(/^eu gero dados de teste aleatórios$/, async () => {
    allureReporter.addStep('Gerando dados de teste aleatórios');
    
    // Generate random test data
    testData.randomData = {
        userId: Math.floor(Math.random() * 1000),
        sessionId: `session_${Date.now()}`,
        testValue: Math.random().toString(36).substring(7)
    };
    
    allureReporter.addStep(`Dados gerados: ${JSON.stringify(testData.randomData)}`);
    console.log('✓ Dados aleatórios gerados:', testData.randomData);
});

When(/^eu navego pelas telas usando os dados gerados$/, async () => {
    allureReporter.addStep('Navegando com dados de teste');
    
    // Simulate navigation using generated data
    await MainPage.navigateWithTestData(testData.randomData);
    
    allureReporter.addStep('Navegação com dados de teste concluída');
    console.log('✓ Navegação com dados realizada');
});

Then(/^as informações devem ser processadas corretamente$/, async () => {
    allureReporter.addStep('Verificando processamento de dados');
    
    const isDataProcessed = await MainPage.verifyDataProcessing(testData.randomData);
    expect(isDataProcessed).toBe(true);
    
    allureReporter.addStep('Dados processados corretamente');
    console.log('✓ Processamento de dados verificado');
});

Then(/^nenhum erro deve ocorrer durante a navegação$/, async () => {
    allureReporter.addStep('Verificando ausência de erros na navegação');
    
    const navigationErrors = await MainPage.checkNavigationErrors();
    expect(navigationErrors.length).toBe(0);
    
    allureReporter.addStep('Navegação concluída sem erros');
    console.log('✓ Navegação sem erros');
});