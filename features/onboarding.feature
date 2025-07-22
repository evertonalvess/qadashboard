@mobile @android @smoke
Feature: Onboarding
  Como um usuário do aplicativo
  Eu quero verificar se o aplicativo abre corretamente
  Para garantir que posso usar suas funcionalidades

  Background:
    Given que o dispositivo está conectado
    And o aplicativo está instalado

  @critical @regression
  Scenario: Abrir aplicativo
    Given o aplicativo é iniciado
    Then o título da tela inicial deve ser exibido
    And a logo do aplicativo deve estar visível
    When eu tiro uma screenshot da tela inicial
    Then a screenshot deve ser salva com sucesso

  @ui @elements
  Scenario: Validar elementos da tela principal
    Given o aplicativo é iniciado
    When eu verifico os elementos principais da tela
    Then o menu principal deve estar presente
    And os botões de navegação devem estar visíveis
    And nenhuma mensagem de erro deve ser exibida

  @navigation @links
  Scenario: Testar navegação básica
    Given o aplicativo é iniciado
    When eu clico no botão "API Demos"
    Then a tela de demonstrações deve ser carregada
    And o título "API Demos" deve estar visível
    When eu volto para a tela anterior
    Then devo estar na tela inicial novamente

  @performance @loading
  Scenario: Validar tempo de carregamento do aplicativo
    Given que eu meço o tempo de início
    When o aplicativo é iniciado
    Then o aplicativo deve carregar em menos de 10 segundos
    And todos os elementos essenciais devem estar carregados

  @data @faker
  Scenario: Testar com dados dinâmicos
    Given o aplicativo é iniciado
    When eu gero dados de teste aleatórios
    And eu navego pelas telas usando os dados gerados
    Then as informações devem ser processadas corretamente
    And nenhum erro deve ocorrer durante a navegação