const messages = require("./../../messages");

const createExitResponse = handlerInput => {
  return handlerInput.responseBuilder.speak(messages.EXIT).getResponse();
};

const createGenericErrorResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.LOCATION_FAILURE)
    .reprompt(messages.LOCATION_FAILURE)
    .getResponse();
};
module.exports = { createExitResponse, createGenericErrorResponse };
