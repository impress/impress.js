var devices = {};
devices.android = ['android_phone', 'android_tablet'];
devices.ios = ['iphone', 'ipad'];

var desireds = {
  selenium: {},
  appium: {}
};

desireds.appium.android_phone = {
  browserName: 'chrome',
  'appium-version': '1.1',
  platformName: 'Android',
  platformVersion: '4.3',
  deviceName: 'Android Emulator',
};

// TODO
// desireds.appium.android_tablet = _.merge(_.clone(desireds.appium.android_phone), {'device-type': 'tablet'});

desireds.appium.iphone = {
  browserName: '',
  'appium-version': '1.1',
  platformName: 'iOS',
  platformVersion: '7.1',
  deviceName: 'iPhone Simulator',
  app: 'safari',
  'device-orientation': 'portrait'
};

desireds.appium.ipad = _.merge(_.clone(desireds.appium.iphone), {deviceName: 'iPad Simulator'});

env.APPIUM = process.env.APPIUM;

var cat, device;
_(devices).each(function(_devices, _cat) {
  if(env.BROWSER === _cat){
    device = _devices[0];
    cat = _cat;
  }
  else {
    _(_devices).each(function(_device) {
      if(env.BROWSER === _device) {
        device = _device;
        cat = _cat;
      }
    }).value();
  }
}).value();

if(device){
  env.BROWSER_SKIP = cat;
  env[cat.toUpperCase()] = true;
  env.MOBILE = true;
  env.DESIRED = desireds.appium[device];
}
