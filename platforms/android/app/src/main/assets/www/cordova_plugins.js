cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "nodejs-mobile-cordova.nodejs",
      "file": "plugins/nodejs-mobile-cordova/www/nodejs_apis.js",
      "pluginId": "nodejs-mobile-cordova",
      "clobbers": [
        "nodejs"
      ]
    },
    {
      "id": "nodejs-mobile-cordova.nodejs_events",
      "file": "plugins/nodejs-mobile-cordova/www/nodejs_events.js",
      "pluginId": "nodejs-mobile-cordova",
      "clobbers": [
        "nodejs_events"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-inappbrowser": "5.0.0",
    "nodejs-mobile-cordova": "0.4.3",
    "cordova-plugin-console": "1.1.0"
  };
});