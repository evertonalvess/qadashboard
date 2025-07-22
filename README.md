# Auto Mobile Appium

Projeto de automação mobile utilizando Appium com WebDriverIO, Cucumber e Allure Reports para testes funcionais automatizados em dispositivos Android.

## Descrição

Este projeto demonstra a implementação de testes automatizados mobile utilizando as principais ferramentas do mercado: Appium para interação com dispositivos móveis, WebDriverIO como framework de automação, Cucumber para BDD (Behavior Driven Development) e Allure para geração de relatórios avançados.

## Tecnologias Utilizadas

- **Node.js 16+**
- **Appium 2.2.1** - Servidor de automação mobile
- **WebDriverIO 8.24.1** - Framework de automação web/mobile
- **Cucumber 8.24.1** - Framework BDD para testes em linguagem natural
- **Allure Reports 2.25.0** - Geração de relatórios avançados
- **Android SDK** - Para testes em dispositivos Android

## Pré-requisitos

### Ambiente de Desenvolvimento

1. **Node.js e npm**:
   ```bash
   # Verificar instalação
   node --version  # v16.0.0 ou superior
   npm --version   # 8.0.0 ou superior
   ```

2. **Java Development Kit (JDK)**:
   ```bash
   # Instalar JDK 8 ou superior
   java -version
   javac -version
   ```

3. **Android SDK e Android Studio**:
   - Baixe o Android Studio: https://developer.android.com/studio
   - Configure as variáveis de ambiente:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
     export ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk  # Windows
     export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
     ```

4. **Emulador Android ou Dispositivo Físico**:
   - Configure um AVD (Android Virtual Device) no Android Studio
   - Ou conecte um dispositivo físico com USB Debugging habilitado

### Verificação do Ambiente

```bash
# Verificar se ADB está funcionando
adb devices

# Verificar se emulador está rodando
adb shell getprop ro.build.version.release
```

## Estrutura do Projeto

```
auto-mobile-appium/
├── .vscode/                    # Configurações do VS Code
│   ├── settings.json          # Configurações do editor
│   └── launch.json           # Configurações de debug
├── features/                   # Arquivos de teste Cucumber
│   ├── onboarding.feature     # Cenários de teste em Gherkin
│   ├── step-definitions/      # Implementação dos steps
│   │   └── onboarding.steps.js
│   └── support/              # Arquivos de apoio
│       └── hooks.js          # Hooks do Cucumber
├── pages/                     # Page Objects
│   └── main.page.js          # Página principal da aplicação
├── allure-results/           # Resultados dos testes (gerado)
├── allure-report/           # Relatório HTML (gerado)
├── wdio.conf.js            # Configuração do WebDriverIO
├── package.json            # Dependências e scripts
├── .env.example           # Exemplo de variáveis de ambiente
└── README.md             # Documentação do projeto
```

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/evertonalvess/auto-mobile-appium.git
   cd auto-mobile-appium
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente** (opcional):
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Baixe o APK de teste** (ApiDemos):
   ```bash
   mkdir apps
   # Baixe ApiDemos-debug.apk e coloque na pasta apps/
   # Ou configure o caminho do seu APK no .env
   ```

## Configuração

### Variáveis de Ambiente (.env)

```bash
# Configurações do dispositivo
ANDROID_VERSION=11.0
DEVICE_NAME=Pixel_5_API_30
UDID=emulator-5554

# Configurações do aplicativo
APP_PATH=./apps/ApiDemos-debug.apk
APP_PACKAGE=io.appium.android.apis
APP_ACTIVITY=.ApiDemos

# Configurações do teste
TEST_ENV=local
IMPLICIT_WAIT=10
```

### Configuração do Emulador

```bash
# Listar AVDs disponíveis
emulator -list-avds

# Iniciar emulador específico
emulator -avd Pixel_5_API_30

# Verificar se o dispositivo está conectado
adb devices
```

## Execução dos Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar testes específicos do Android
npm run test:android

# Iniciar servidor Appium manualmente
npm run appium
```

### Execução com Tags

```bash
# Apenas testes críticos
npx wdio run wdio.conf.js --cucumberOpts.tagExpression='@critical'

# Testes de smoke
npx wdio run wdio.conf.js --cucumberOpts.tagExpression='@smoke'

# Excluir testes de performance
npx wdio run wdio.conf.js --cucumberOpts.tagExpression='not @performance'

# Executar múltiplas tags
npx wdio run wdio.conf.js --cucumberOpts.tagExpression='@mobile and @android'
```

### Execução com Configurações Específicas

```bash
# Dispositivo específico
DEVICE_NAME=Pixel_4_API_29 npm test

# Versão específica do Android
ANDROID_VERSION=10.0 npm test

# App específico
APP_PATH=/path/to/your/app.apk npm test
```

## Relatórios Allure

### Geração e Visualização

```bash
# Gerar relatório Allure
npm run allure:generate

# Abrir relatório no navegador
npm run allure:open

# Servir relatório (gera e abre automaticamente)
npm run allure:serve
```

### Funcionalidades do Relatório

- **Dashboard**: Visão geral dos resultados
- **Screenshots**: Capturas automáticas em falhas
- **Logs**: Logs detalhados de cada step
- **Timeline**: Linha do tempo da execução
- **Trends**: Histórico de execuções
- **Categories**: Categorização de falhas

## Cenários de Teste Implementados

### Feature: Onboarding

1. **Abrir aplicativo** (`@critical @regression`)
   - Verifica se o app inicia corretamente
   - Valida título e logo da tela inicial
   - Captura screenshot de evidência

2. **Validar elementos da tela principal** (`@ui @elements`)
   - Verifica presença do menu principal
   - Valida botões de navegação
   - Confirma ausência de mensagens de erro

3. **Testar navegação básica** (`@navigation @links`)
   - Navega para tela de demonstrações
   - Verifica carregamento da nova tela
   - Testa navegação de volta

4. **Validar tempo de carregamento** (`@performance @loading`)
   - Mede tempo de inicialização do app
   - Verifica se carrega em menos de 10 segundos
   - Confirma carregamento de elementos essenciais

5. **Testar com dados dinâmicos** (`@data @faker`)
   - Gera dados de teste aleatórios
   - Navega usando os dados gerados
   - Verifica processamento correto

## Page Objects

### MainPage (main.page.js)

```javascript
// Exemplo de uso
const MainPage = require('../pages/main.page');

// Aguardar carregamento do app
await MainPage.waitForAppToLoad();

// Verificar título
const hasTitle = await MainPage.isMainTitleDisplayed();

// Clicar em botão
await MainPage.clickButton('API Demos');
```

**Métodos principais**:
- `waitForAppToLoad()` - Aguarda carregamento do aplicativo
- `isMainTitleDisplayed()` - Verifica se título está visível
- `clickButton(text)` - Clica em botão por texto
- `takeScreenshot(name)` - Captura screenshot personalizada

## Debugging e Troubleshooting

### Debug no VS Code

1. **Configuração de Debug**:
   - Use F5 para iniciar debug
   - Configurações disponíveis em `.vscode/launch.json`
   - Breakpoints nos step definitions

2. **Debug de Testes Específicos**:
   ```bash
   # Debug de feature específica
   npx wdio run wdio.conf.js --spec=./features/onboarding.feature
   ```

### Problemas Comuns

1. **Appium Server não inicia**:
   ```bash
   # Verificar se porta está em uso
   lsof -i :4723
   
   # Matar processo na porta
   kill -9 $(lsof -t -i:4723)
   ```

2. **Dispositivo não encontrado**:
   ```bash
   # Verificar dispositivos conectados
   adb devices
   
   # Reiniciar ADB
   adb kill-server && adb start-server
   ```

3. **App não instala**:
   ```bash
   # Verificar se APK existe
   ls -la apps/
   
   # Instalar manualmente
   adb install apps/ApiDemos-debug.apk
   ```

4. **Elementos não encontrados**:
   ```bash
   # Capturar page source para debug
   adb shell uiautomator dump
   adb pull /sdcard/window_dump.xml
   ```

### Logs e Diagnostico

```bash
# Logs do Appium
tail -f appium.log

# Logs do dispositivo
adb logcat | grep -E "(ERROR|FATAL)"

# Performance do dispositivo
adb shell top | head -20
```

## Integração Contínua

### GitHub Actions

```yaml
name: Mobile Tests
on: [push, pull_request]

jobs:
  mobile-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Install dependencies
      run: npm ci
      
    - name: Start emulator
      run: |
        echo "no" | avdmanager create avd --force --name test --abi google_apis/x86_64 --package 'system-images;android-30;google_apis;x86_64'
        emulator -avd test -no-window -no-audio -no-boot-anim &
        
    - name: Wait for emulator
      run: adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;'
      
    - name: Run tests
      run: npm test
      
    - name: Generate Allure Report
      run: npm run allure:generate
      
    - name: Upload Allure Results
      uses: actions/upload-artifact@v3
      with:
        name: allure-results
        path: allure-results/
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Start Android Emulator') {
            steps {
                sh 'emulator -avd test_device -no-window &'
                sh 'adb wait-for-device'
            }
        }
        
        stage('Run Mobile Tests') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Generate Reports') {
            steps {
                sh 'npm run allure:generate'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    reportName: 'Allure Report'
                ])
            }
        }
    }
    
    post {
        always {
            sh 'adb emu kill'
        }
    }
}
```

## Boas Práticas

### Estrutura de Testes

1. **Page Objects**: Mantenha elementos e ações organizados
2. **Step Definitions**: Implemente steps reutilizáveis
3. **Hooks**: Use para setup/teardown e captura de evidências
4. **Data Management**: Use dados dinâmicos quando possível

### Performance

1. **Waits Inteligentes**: Use waits explícitos ao invés de sleeps
2. **Screenshots**: Capture apenas quando necessário
3. **Parallel Execution**: Configure execução paralela quando possível
4. **Resource Cleanup**: Sempre limpe recursos após os testes

### Manutenibilidade

1. **Seletores Robustos**: Use seletores estáveis e únicos
2. **Documentação**: Mantenha documentação atualizada
3. **Code Review**: Revise código antes de fazer merge
4. **Versionamento**: Use versionamento semântico

## Extensões e Melhorias

### Próximos Passos

- [ ] Implementar testes para iOS
- [ ] Adicionar testes de API integrados
- [ ] Configurar execução paralela
- [ ] Implementar visual regression testing
- [ ] Adicionar testes de acessibilidade
- [ ] Integrar com ferramentas de CI/CD

### Ferramentas Complementares

- **Appium Inspector**: Para identificar elementos
- **Android Studio**: IDE e emulador
- **Scrcpy**: Espelhamento de tela
- **Genymotion**: Emulador alternativo

## Suporte e Contribuição

### Documentação Adicional

- [Appium Documentation](http://appium.io/docs/en/about-appium/intro/)
- [WebDriverIO Documentation](https://webdriver.io/)
- [Cucumber Documentation](https://cucumber.io/docs)
- [Allure Documentation](https://docs.qameta.io/allure/)

### Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

### Suporte

Para dúvidas e problemas:
- Abra uma issue no GitHub
- Consulte os logs em `appium.log`
- Verifique a documentação oficial das ferramentas

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.