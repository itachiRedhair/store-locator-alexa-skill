const { supportsDisplay } = require("./../helper/display.helper");

//messages
const messages = require("./../../messages");
const { getDefaultCard } = require("./../../messages").cardGenerators;

//constants
const permission = require("./../../constants").PERMISSIONS;

const createAskDevicePermissionResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.NOTIFY_MISSING_PERMISSIONS)
    .withAskForPermissionsConsentCard(permission.DEVICE_ADDRESS_PERMISSIONS)
    .getResponse();
};

module.exports = { createAskDevicePermissionResponse };
