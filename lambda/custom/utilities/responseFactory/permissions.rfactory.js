//messages
const messages = require("./../../messages");

//constants
const permission = require("./../../constants").PERMISSIONS;

const createAskDevicePermissionResponse = handlerInput => {
  return handlerInput
    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
    .withAskForPermissionsConsentCard(permission.DEVICE_ADDRESS_PERMISSIONS)
    .getResponse();
};

module.exports = { createAskDevicePermissionResponse };
