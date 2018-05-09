const messages = require("./../../messages");
const { getDefaultCard } = require("./../../messages").cardGenerators;
const { supportsDisplay } = require("./../helper/display.helper");

const createGreetingResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.GREETING + " " + messages.START_HELP_MESSAGE)
    .reprompt(messages.START_HELP_MESSAGE)
    .getResponse();
};

const createExitResponse = handlerInput => {
  return handlerInput.responseBuilder.speak(messages.EXIT).getResponse();
};

const createGenericErrorResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.LOCATION_FAILURE)
    .reprompt(messages.LOCATION_FAILURE)
    .getResponse();
};

const createHelpResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.INSTRUCTIONS)
    .reprompt(messages.INSTRUCTIONS)
    .getResponse();
};

module.exports = {
  createExitResponse,
  createGenericErrorResponse,
  createHelpResponse,
  createGreetingResponse
};
