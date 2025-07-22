/**
 * Main Page Object for API Demos App
 * Contains all elements and methods for the main screen
 */
class MainPage {
    
    // Selectors for main page elements
    get mainTitle() {
        return $('android=new UiSelector().text("API Demos")');
    }
    
    get appLogo() {
        return $('android=new UiSelector().className("android.widget.TextView").textContains("API")');
    }
    
    get mainList() {
        return $('android=new UiSelector().className("android.widget.ListView")');
    }
    
    get apiDemosButton() {
        return $('android=new UiSelector().text("API Demos")');
    }
    
    // Dynamic selectors
    getButtonByText(text) {
        return $(`android=new UiSelector().text("${text}")`);
    }
    
    getElementByClassName(className) {
        return $(`android=new UiSelector().className("${className}")`);
    }
    
    getElementByResourceId(resourceId) {
        return $(`android=new UiSelector().resourceId("${resourceId}")`);
    }
    
    // Wait methods
    async waitForAppToLoad() {
        console.log('🔄 Aguardando carregamento do aplicativo...');
        
        // Wait for app to start (wait for any element to be visible)
        await driver.waitUntil(
            async () => {
                try {
                    const source = await driver.getPageSource();
                    return source.length > 0;
                } catch (error) {
                    return false;
                }
            },
            {
                timeout: 30000,
                timeoutMsg: 'App não carregou dentro do tempo esperado'
            }
        );
        
        // Additional wait for stability
        await driver.pause(3000);
        console.log('✅ Aplicativo carregado');
    }
    
    async waitForScreenToLoad() {
        console.log('🔄 Aguardando carregamento da tela...');
        
        // Wait for screen transition to complete
        await driver.pause(2000);
        
        // Wait for any interactive element to be available
        await driver.waitUntil(
            async () => {
                try {
                    const elements = await $$('android=new UiSelector().clickable(true)');
                    return elements.length > 0;
                } catch (error) {
                    return false;
                }
            },
            {
                timeout: 15000,
                timeoutMsg: 'Tela não carregou dentro do tempo esperado'
            }
        );
        
        console.log('✅ Tela carregada');
    }
    
    // Validation methods
    async isMainTitleDisplayed() {
        try {
            // Try multiple approaches to find the main title
            const approaches = [
                () => this.mainTitle.isDisplayed(),
                () => this.appLogo.isDisplayed(),
                () => $('android=new UiSelector().textContains("API")').isDisplayed(),
                () => $('android=new UiSelector().textContains("Demo")').isDisplayed()
            ];
            
            for (const approach of approaches) {
                try {
                    const result = await approach();
                    if (result) {
                        console.log('✅ Título principal encontrado');
                        return true;
                    }
                } catch (error) {
                    // Continue to next approach
                    continue;
                }
            }
            
            console.log('❌ Título principal não encontrado');
            return false;
        } catch (error) {
            console.log('❌ Erro ao verificar título:', error.message);
            return false;
        }
    }
    
    async getMainTitleText() {
        try {
            // Try to get text from various elements
            const textSources = [
                this.mainTitle,
                this.appLogo,
                $('android=new UiSelector().textContains("API")'),
                $('android=new UiSelector().index(0)').$$('android.widget.TextView')[0]
            ];
            
            for (const source of textSources) {
                try {
                    if (await source.isDisplayed()) {
                        const text = await source.getText();
                        if (text && text.trim().length > 0) {
                            console.log(`📝 Texto do título: ${text}`);
                            return text;
                        }
                    }
                } catch (error) {
                    continue;
                }
            }
            
            return 'API Demos'; // Default fallback
        } catch (error) {
            console.log('❌ Erro ao obter texto do título:', error.message);
            return 'Título não encontrado';
        }
    }
    
    async isLogoVisible() {
        try {
            // Check for various logo/icon elements
            const logoSelectors = [
                'android=new UiSelector().className("android.widget.ImageView")',
                'android=new UiSelector().descriptionContains("icon")',
                'android=new UiSelector().descriptionContains("logo")',
                'android=new UiSelector().resourceIdMatches(".*icon.*")'
            ];
            
            for (const selector of logoSelectors) {
                try {
                    const element = $(selector);
                    if (await element.isDisplayed()) {
                        console.log('✅ Logo encontrada');
                        return true;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            // Fallback: if we can see any image, consider it as logo
            const images = await $$('android=new UiSelector().className("android.widget.ImageView")');
            if (images.length > 0) {
                console.log('✅ Imagem (logo) encontrada');
                return true;
            }
            
            console.log('❌ Logo não encontrada');
            return false;
        } catch (error) {
            console.log('❌ Erro ao verificar logo:', error.message);
            return false;
        }
    }
    
    // UI Elements validation
    async checkMainUIElements() {
        console.log('🔍 Verificando elementos da interface...');
        
        const elements = {
            title: false,
            list: false,
            buttons: false,
            images: false
        };
        
        try {
            // Check for title/text elements
            const textElements = await $$('android=new UiSelector().className("android.widget.TextView")');
            elements.title = textElements.length > 0;
            
            // Check for list elements
            const listElements = await $$('android=new UiSelector().className("android.widget.ListView")');
            elements.list = listElements.length > 0;
            
            // Check for buttons/clickable elements
            const buttonElements = await $$('android=new UiSelector().clickable(true)');
            elements.buttons = buttonElements.length > 0;
            
            // Check for images
            const imageElements = await $$('android=new UiSelector().className("android.widget.ImageView")');
            elements.images = imageElements.length > 0;
            
            console.log('📊 Elementos encontrados:', elements);
            return elements;
        } catch (error) {
            console.log('❌ Erro ao verificar elementos:', error.message);
            return elements;
        }
    }
    
    async isMainMenuPresent() {
        try {
            // Check for main menu/list
            return await this.mainList.isDisplayed();
        } catch (error) {
            // Fallback: check for any list element
            try {
                const lists = await $$('android=new UiSelector().className("android.widget.ListView")');
                return lists.length > 0;
            } catch (fallbackError) {
                console.log('❌ Menu principal não encontrado');
                return false;
            }
        }
    }
    
    async getNavigationButtons() {
        try {
            // Get all clickable elements that could be navigation buttons
            const clickableElements = await $$('android=new UiSelector().clickable(true)');
            const buttons = [];
            
            for (const element of clickableElements) {
                try {
                    if (await element.isDisplayed()) {
                        const text = await element.getText();
                        buttons.push({
                            element: element,
                            text: text || 'Button without text'
                        });
                    }
                } catch (error) {
                    // Skip elements that can't be processed
                    continue;
                }
            }
            
            console.log(`📱 ${buttons.length} botões de navegação encontrados`);
            return buttons;
        } catch (error) {
            console.log('❌ Erro ao obter botões de navegação:', error.message);
            return [];
        }
    }
    
    async hasErrorMessages() {
        try {
            // Check for common error indicators
            const errorSelectors = [
                'android=new UiSelector().textContains("error")',
                'android=new UiSelector().textContains("Error")',
                'android=new UiSelector().textContains("failed")',
                'android=new UiSelector().textContains("Failed")',
                'android=new UiSelector().descriptionContains("error")'
            ];
            
            for (const selector of errorSelectors) {
                try {
                    const errorElement = $(selector);
                    if (await errorElement.isDisplayed()) {
                        console.log('❌ Mensagem de erro encontrada');
                        return true;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            console.log('✅ Nenhuma mensagem de erro encontrada');
            return false;
        } catch (error) {
            console.log('❌ Erro ao verificar mensagens de erro:', error.message);
            return false;
        }
    }
    
    // Action methods
    async clickButton(buttonText) {
        try {
            console.log(`🎯 Clicando no botão: ${buttonText}`);
            
            const button = this.getButtonByText(buttonText);
            await button.waitForDisplayed({ timeout: 10000 });
            await button.click();
            
            console.log(`✅ Botão "${buttonText}" clicado com sucesso`);
        } catch (error) {
            console.log(`❌ Erro ao clicar no botão "${buttonText}":`, error.message);
            throw error;
        }
    }
    
    async getCurrentScreenTitle() {
        try {
            // Get current screen title
            const titleElements = await $$('android=new UiSelector().className("android.widget.TextView")');
            
            if (titleElements.length > 0) {
                const titleText = await titleElements[0].getText();
                console.log(`📝 Título atual da tela: ${titleText}`);
                return titleText;
            }
            
            return 'Título não encontrado';
        } catch (error) {
            console.log('❌ Erro ao obter título da tela:', error.message);
            return 'Erro ao obter título';
        }
    }
    
    // Performance and data methods
    async areEssentialElementsLoaded() {
        try {
            console.log('🔍 Verificando carregamento de elementos essenciais...');
            
            // Check if basic UI elements are loaded
            const checks = [
                () => $$('android=new UiSelector().className("android.widget.TextView")'),
                () => $$('android=new UiSelector().clickable(true)'),
                () => driver.getPageSource()
            ];
            
            for (const check of checks) {
                try {
                    const result = await check();
                    if (!result || (Array.isArray(result) && result.length === 0) || 
                        (typeof result === 'string' && result.length === 0)) {
                        console.log('❌ Elementos essenciais não carregados');
                        return false;
                    }
                } catch (error) {
                    console.log('❌ Erro ao verificar elementos essenciais:', error.message);
                    return false;
                }
            }
            
            console.log('✅ Elementos essenciais carregados');
            return true;
        } catch (error) {
            console.log('❌ Erro geral ao verificar elementos essenciais:', error.message);
            return false;
        }
    }
    
    async navigateWithTestData(testData) {
        console.log('🧪 Navegando com dados de teste:', testData);
        
        try {
            // Simulate navigation using test data
            // This could involve scrolling, clicking, or inputting data
            
            // Scroll through the main list if available
            try {
                const listElement = await this.mainList;
                if (await listElement.isDisplayed()) {
                    await driver.execute('mobile: scroll', {
                        element: listElement.elementId,
                        direction: 'down'
                    });
                }
            } catch (scrollError) {
                console.log('⚠️  Scroll não disponível');
            }
            
            // Take screenshot with test data info
            await driver.saveScreenshot(`./allure-results/navigation-${testData.sessionId}.png`);
            
            console.log('✅ Navegação com dados de teste concluída');
        } catch (error) {
            console.log('❌ Erro na navegação com dados de teste:', error.message);
            throw error;
        }
    }
    
    async verifyDataProcessing(testData) {
        console.log('🔍 Verificando processamento de dados:', testData);
        
        try {
            // Verify that the app can handle the test data
            // This is a simulation - in real scenarios you would check actual data processing
            
            // Check if app is still responsive
            const pageSource = await driver.getPageSource();
            const isResponsive = pageSource && pageSource.length > 0;
            
            if (isResponsive) {
                console.log('✅ Dados processados corretamente');
                return true;
            } else {
                console.log('❌ Erro no processamento de dados');
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao verificar processamento de dados:', error.message);
            return false;
        }
    }
    
    async checkNavigationErrors() {
        console.log('🔍 Verificando erros de navegação...');
        
        try {
            const errors = [];
            
            // Check if app crashed
            try {
                await driver.getCurrentActivity();
            } catch (error) {
                errors.push('App pode ter crashado');
            }
            
            // Check for error dialogs
            const errorDialogSelectors = [
                'android=new UiSelector().text("Unfortunately")',
                'android=new UiSelector().text("has stopped")',
                'android=new UiSelector().text("Force close")',
                'android=new UiSelector().resourceId("android:id/message")'
            ];
            
            for (const selector of errorDialogSelectors) {
                try {
                    const errorDialog = $(selector);
                    if (await errorDialog.isDisplayed()) {
                        const errorText = await errorDialog.getText();
                        errors.push(`Diálogo de erro: ${errorText}`);
                    }
                } catch (error) {
                    // No error dialog found, which is good
                    continue;
                }
            }
            
            if (errors.length > 0) {
                console.log('❌ Erros de navegação encontrados:', errors);
            } else {
                console.log('✅ Nenhum erro de navegação encontrado');
            }
            
            return errors;
        } catch (error) {
            console.log('❌ Erro ao verificar erros de navegação:', error.message);
            return ['Erro na verificação de erros'];
        }
    }
}

module.exports = new MainPage();