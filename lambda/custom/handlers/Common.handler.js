const {
  setSession,
  getSession
} = require("./../utilities/helper/session.helper");

//response builders
const {
  createExitResponse
} = require("./../utilities/responseFactory/general.rfactory");

//constants
const intents = require("./../constants").intents;
const states = require("./../constants").states;
const session = require("./../constants").session;

//messages
const messages = require("./../messages");

//All unhandled request will get here
const StopHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === intents.type.IntentRequest &&
      (request.intent.name === intents.AMAZON.StopIntent ||
        request.intent.name === intents.AMAZON.CancelIntent)
    );
  },

  handle(handlerInput) {
    return createExitResponse(handlerInput);
  }
};

module.exports = { StopHandler };
