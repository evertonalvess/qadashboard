const { Before, After, BeforeAll, AfterAll, BeforeStep, AfterStep } = require('@wdio/cucumber-framework');
const allureReporter = require('@wdio/allure-reporter').default;

// Global test configuration
let testStartTime;
let stepStartTime;

/**
 * Hook executed before all test scenarios
 */
BeforeAll(async () => {
    console.log('🚀 Iniciando suite de testes mobile');
    console.log('📱 Configurando ambiente de teste');
    
    // Set global test configuration
    testStartTime = Date.now();
    
    // Add environment info to Allure report
    allureReporter.addEnvironment('Platform', 'Android');
    allureReporter.addEnvironment('Automation Tool', 'Appium + WebDriverIO');
    allureReporter.addEnvironment('Framework', 'Cucumber');
    allureReporter.addEnvironment('Test Environment', process.env.TEST_ENV || 'local');
    allureReporter.addEnvironment('Device', process.env.DEVICE_NAME || 'Pixel_5_API_30');
    allureReporter.addEnvironment('Android Version', process.env.ANDROID_VERSION || '11.0');
});

/**
 * Hook executed before each test scenario
 */
Before(async (scenario) => {
    const scenarioName = scenario.pickle.name;
    const featureName = scenario.gherkinDocument.feature.name;
    
    console.log(`\n📋 Iniciando cenário: ${scenarioName}`);
    console.log(`📂 Feature: ${featureName}`);
    
    // Add scenario info to Allure
    allureReporter.addFeature(featureName);
    allureReporter.addStory(scenarioName);
    
    // Add tags to Allure report
    if (scenario.pickle.tags && scenario.pickle.tags.length > 0) {
        scenario.pickle.tags.forEach(tag => {
            allureReporter.addLabel('tag', tag.name.replace('@', ''));
        });
    }
    
    // Set test severity based on tags
    const tags = scenario.pickle.tags.map(tag => tag.name);
    if (tags.includes('@critical')) {
        allureReporter.addLabel('severity', 'critical');
    } else if (tags.includes('@smoke')) {
        allureReporter.addLabel('severity', 'normal');
    } else {
        allureReporter.addLabel('severity', 'minor');
    }
    
    // Take initial screenshot
    try {
        await driver.saveScreenshot(`./allure-results/before-${scenarioName.replace(/\s+/g, '-')}.png`);
        allureReporter.addAttachment('Before Scenario', await driver.takeScreenshot(), 'image/png');
    } catch (error) {
        console.log('⚠️  Não foi possível capturar screenshot inicial:', error.message);
    }
});

/**
 * Hook executed before each test step
 */
BeforeStep(async (step) => {
    stepStartTime = Date.now();
    const stepText = step.pickleStep.text;
    
    console.log(`  🔧 Executando: ${stepText}`);
    
    // Add step info to Allure
    allureReporter.addStep(`Starting: ${stepText}`);
});

/**
 * Hook executed after each test step
 */
AfterStep(async (step, scenario, result) => {
    const stepDuration = Date.now() - stepStartTime;
    const stepText = step.pickleStep.text;
    
    if (result.passed) {
        console.log(`  ✅ Concluído: ${stepText} (${stepDuration}ms)`);
    } else {
        console.log(`  ❌ Falhou: ${stepText} (${stepDuration}ms)`);
        
        // Take screenshot on step failure
        try {
            const failureScreenshot = await driver.takeScreenshot();
            allureReporter.addAttachment(`Step Failure: ${stepText}`, failureScreenshot, 'image/png');
            
            // Add page source for debugging
            const pageSource = await driver.getPageSource();
            allureReporter.addAttachment(`Page Source at Failure`, pageSource, 'text/xml');
        } catch (error) {
            console.log('⚠️  Erro ao capturar evidência de falha:', error.message);
        }
    }
});

/**
 * Hook executed after each test scenario
 */
After(async (scenario) => {
    const scenarioName = scenario.pickle.name;
    const scenarioResult = scenario.result;
    
    if (scenarioResult.status === 'PASSED') {
        console.log(`✅ Cenário aprovado: ${scenarioName}`);
    } else {
        console.log(`❌ Cenário falhou: ${scenarioName}`);
        console.log(`   Motivo: ${scenarioResult.message || 'Erro não especificado'}`);
        
        // Take final screenshot on scenario failure
        try {
            const failureScreenshot = await driver.takeScreenshot();
            allureReporter.addAttachment(`Scenario Failure: ${scenarioName}`, failureScreenshot, 'image/png');
            
            // Add device logs if available
            try {
                const deviceLogs = await driver.getLogs('logcat');
                if (deviceLogs && deviceLogs.length > 0) {
                    const recentLogs = deviceLogs.slice(-50); // Last 50 log entries
                    const logText = recentLogs.map(log => `[${log.level}] ${log.message}`).join('\n');
                    allureReporter.addAttachment('Device Logs', logText, 'text/plain');
                }
            } catch (logError) {
                console.log('⚠️  Não foi possível obter logs do dispositivo:', logError.message);
            }
        } catch (error) {
            console.log('⚠️  Erro ao capturar screenshot final:', error.message);
        }
    }
    
    // Take final screenshot for evidence
    try {
        await driver.saveScreenshot(`./allure-results/after-${scenarioName.replace(/\s+/g, '-')}.png`);
        allureReporter.addAttachment('After Scenario', await driver.takeScreenshot(), 'image/png');
    } catch (error) {
        console.log('⚠️  Não foi possível capturar screenshot final:', error.message);
    }
    
    // Reset app state for next test (optional)
    try {
        if (driver && typeof driver.reset === 'function') {
            await driver.reset();
        }
    } catch (error) {
        console.log('⚠️  Não foi possível resetar o app:', error.message);
    }
    
    console.log(`⏱️  Cenário executado em: ${Date.now() - stepStartTime}ms\n`);
});

/**
 * Hook executed after all test scenarios
 */
AfterAll(async () => {
    const totalTestTime = Date.now() - testStartTime;
    
    console.log('🏁 Finalizando suite de testes');
    console.log(`⏱️  Tempo total de execução: ${Math.round(totalTestTime / 1000)}s`);
    
    // Add execution summary to Allure
    allureReporter.addParameter('Total Execution Time', `${Math.round(totalTestTime / 1000)}s`);
    allureReporter.addParameter('Test Suite', 'Mobile Automation');
    allureReporter.addParameter('Completed At', new Date().toLocaleString());
    
    // Clean up driver session
    try {
        if (driver && typeof driver.deleteSession === 'function') {
            await driver.deleteSession();
        }
    } catch (error) {
        console.log('⚠️  Erro ao finalizar sessão do driver:', error.message);
    }
    
    console.log('📊 Relatórios gerados na pasta allure-results');
    console.log('📱 Testes mobile concluídos com sucesso!');
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    
    // Add error info to Allure if available
    if (allureReporter) {
        allureReporter.addAttachment('Unhandled Error', `${reason}`, 'text/plain');
    }
});

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    
    // Add error info to Allure if available
    if (allureReporter) {
        allureReporter.addAttachment('Uncaught Exception', `${error.stack}`, 'text/plain');
    }
    
    process.exit(1);
});

// Export hooks for external use if needed
module.exports = {
    // Utility functions that can be used in step definitions
    takeScreenshot: async (name) => {
        try {
            const screenshot = await driver.takeScreenshot();
            allureReporter.addAttachment(name, screenshot, 'image/png');
            return screenshot;
        } catch (error) {
            console.log(`⚠️  Erro ao capturar screenshot ${name}:`, error.message);
            return null;
        }
    },
    
    addTestData: (key, value) => {
        allureReporter.addParameter(key, value);
    },
    
    getCurrentTime: () => Date.now(),
    
    calculateDuration: (startTime) => Date.now() - startTime
};