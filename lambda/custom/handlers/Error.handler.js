const messages = require("./../messages");
const permissions = require("./../constants").PERMISSIONS;

const GetAddressError = {
  canHandle(handlerInput, error) {
    return error.name === "ServiceError";
  },

  handle(handlerInput, error) {
    if (error.statusCode === 403) {
      return handlerInput.responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard(
          permissions.DEVICE_ADDRESS_PERMISSIONS
        )
        .getResponse();
    }
    return handlerInput.responseBuilder
      .speak(messages.LOCATION_FAILURE)
      .reprompt(messages.LOCATION_FAILURE)
      .getResponse();
  }
};

const DefaultErrorHandler = {
  canHandle() {
    return true;
  },

  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(messages.GENERIC_ERROR)
      .reprompt(messages.GENERIC_ERROR)
      .getResponse();
  }
};

module.exports = { GetAddressError, DefaultErrorHandler };
