class MainPage {
  // Element selector for the title on the home screen
  get title() {
    return $('//android.widget.TextView[@text="API Demos"]');
  }
}

module.exports = new MainPage();
