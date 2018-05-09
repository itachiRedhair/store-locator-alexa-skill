//messages
const messages = require("./../messages");

//response builders
const {
  createGreetingResponse
} = require("./../utilities/responseFactory/general.rfactory");

//constants
const intents = require("./../constants").intents;

const NewSessionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === intents.LaunchRequest;
  },

  handle(handlerInput) {
    return createGreetingResponse(handlerInput);
  }
};

module.exports = { NewSessionHandler };
