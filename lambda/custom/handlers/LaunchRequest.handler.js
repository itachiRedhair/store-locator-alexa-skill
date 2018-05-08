//messages
const messages = require("./../messages");

//constants
const intents = require("./../constants").intents;

const NewSessionHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.session.new ||
      handlerInput.requestEnvelope.request.type === intents.LaunchRequest
    );
  },

  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(messages.GREETING + " " + messages.START_HELP_MESSAGE)
      .reprompt(messages.START_HELP_MESSAGE)
      .getResponse();
  }
};

module.exports = { NewSessionHandler };
