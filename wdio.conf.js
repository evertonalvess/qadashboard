require('dotenv').config();

const { join } = require('path');

exports.config = {
    // WebDriver configuration
    runner: 'local',
    port: 4723,
    path: '/',
    
    // Test specifications
    specs: [
        './features/**/*.feature'
    ],
    
    // Patterns to exclude
    exclude: [],
    
    // Maximum instances to run
    maxInstances: 1,
    
    // Capabilities for Android testing
    capabilities: [{
        platformName: 'Android',
        'appium:platformVersion': process.env.ANDROID_VERSION || '11.0',
        'appium:deviceName': process.env.DEVICE_NAME || 'Pixel_5_API_30',
        'appium:automationName': 'UiAutomator2',
        'appium:app': process.env.APP_PATH || join(process.cwd(), 'apps', 'ApiDemos-debug.apk'),
        'appium:appPackage': process.env.APP_PACKAGE || 'io.appium.android.apis',
        'appium:appActivity': process.env.APP_ACTIVITY || '.ApiDemos',
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:noReset': false,
        'appium:fullReset': false
    }],
    
    // Level of logging verbosity
    logLevel: 'info',
    
    // Set specific log levels per logger
    logLevels: {
        webdriver: 'info',
        '@wdio/appium-service': 'info'
    },
    
    // If you only want to run your tests until a specific amount of tests have failed use bail
    bail: 0,
    
    // Default base URL for the environment
    baseUrl: '',
    
    // Default timeout for all waitFor* commands
    waitforTimeout: 10000,
    
    // Default timeout in milliseconds for request if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    
    // Default request retries count
    connectionRetryCount: 3,
    
    // Test framework to use
    framework: 'cucumber',
    
    // Cucumber framework options
    cucumberOpts: {
        // Require files before executing features
        require: ['./features/step-definitions/*.js'],
        
        // Show full backtrace for errors
        backtrace: false,
        
        // Require modules for compilation
        requireModule: [],
        
        // Enable dry-run mode
        dryRun: false,
        
        // Fail fast
        failFast: false,
        
        // Cucumber output format
        format: ['pretty'],
        
        // Cucumber output snippets
        snippets: true,
        
        // Source code is loaded
        source: true,
        
        // Cucumber profile
        profile: [],
        
        // Strict mode
        strict: false,
        
        // Tag expressions to filter scenarios
        tagExpression: '',
        
        // Timeout for step definitions
        timeout: 60000,
        
        // Ignore undefined definitions
        ignoreUndefinedDefinitions: false
    },
    
    // Test reporter configurations
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true
        }]
    ],
    
    // Services configuration
    services: [
        ['appium', {
            args: {
                address: 'localhost',
                port: 4723,
                relaxedSecurity: true,
                allowInsecure: ['adb_shell'],
                denyInsecure: [],
                log: './appium.log',
                logLevel: 'info'
            },
            command: 'appium'
        }]
    ],
    
    // Hooks configuration
    
    // Hook that gets executed once before all workers get launched
    onPrepare: function (config, capabilities) {
        console.log('*******************');
        console.log('** Starting Test **');
        console.log('*******************');
    },
    
    // Hook that gets executed before a worker process is spawned
    onWorkerStart: function (cid, caps, specs, args, execArgv) {
        // Worker started
    },
    
    // Hook that gets executed just before initialising the webdriver session and test framework
    beforeSession: function (config, capabilities, specs, cid) {
        require('./features/support/hooks');
    },
    
    // Hook that gets executed before test execution begins
    before: function (capabilities, specs) {
        // Global before hook
    },
    
    // Hook that gets executed after test execution ends
    after: function (result, capabilities, specs) {
        // Global after hook
    },
    
    // Hook that gets executed after all tests are done
    onComplete: function (exitCode, config, capabilities, results) {
        console.log('*******************');
        console.log('** Test Complete **');
        console.log('*******************');
        
        // Generate Allure report automatically
        const allure = require('allure-commandline');
        const generation = allure(['generate', 'allure-results', '--clean']);
        
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(() => {
                reject(new Error('Could not generate Allure report within timeout'));
            }, 5000);
            
            generation.on('exit', function(exitCode) {
                clearTimeout(generationTimeout);
                
                if (exitCode !== 0) {
                    reject(new Error('Could not generate Allure report'));
                    return;
                }
                
                console.log('Allure report successfully generated');
                resolve();
            });
        });
    }
};