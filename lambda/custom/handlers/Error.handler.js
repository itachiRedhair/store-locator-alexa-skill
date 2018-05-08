const {
  setSession,
  getSession
} = require("./../utilities/helper/session.helper");

//messages
const messages = require("./../messages");

//constants
const constants = require("./../constants");
const permissions = require("./../constants").PERMISSIONS;
const session = require("./../constants").session;
const states = require("./../constants").states;

//response builders
const {
  createAskDevicePermissionResponse
} = require("./../utilities/responseFactory/permissions.rfactory");
const {
  createGenericErrorResponse
} = require("./../utilities/responseFactory/general.rfactory");

//handlers
const GetAddressError = {
  canHandle(handlerInput, error) {
    return error.name === constants.error.name.SERVICE_ERROR;
  },

  handle(handlerInput, error) {
    if (error.statusCode === constants.error.statusCode.FORBIDDEN) {
      return createAskDevicePermissionResponse(handlerInput);
    }
    return createGenericErrorResponse(handlerInput);
  }
};

const DefaultErrorHandler = {
  canHandle() {
    return true;
  },

  handle(handlerInput, error) {
    setSession(handlerInput, session.STATE, states.NO_STATE);
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(messages.GENERIC_ERROR)
      .reprompt(messages.GENERIC_ERROR)
      .getResponse();
  }
};

module.exports = { GetAddressError, DefaultErrorHandler };
