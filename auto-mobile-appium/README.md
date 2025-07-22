# Auto Mobile Appium

Projeto exemplo de automacao mobile utilizando Appium, WebdriverIO e Cucumber. O objetivo e demonstrar como estruturar testes de forma profissional e gerar relatorios com o Allure.

## Requisitos
- Node.js 18+
- Android SDK configurado
- Emulador ou dispositivo Android

## Instalacao
```bash
npm install
```

## Executando testes
Configure o caminho do APK e a versao do Android em um arquivo `.env`:
```bash
APK_PATH=/caminho/para/ApiDemos-debug.apk
ANDROID_VERSION=11.0
```

Para rodar os testes execute:
```bash
npx wdio run wdio.conf.js
```

## Gerando Allure Report
```bash
npm run allure:generate
npm run allure:open
```

## Appium Server
Certifique-se de iniciar o servidor Appium localmente antes de rodar os testes:
```bash
npx appium
```
