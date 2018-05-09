const { supportsDisplay } = require("./../helper/display.helper");

//messages
const messages = require("./../../messages");
const { getDefaultCard } = require("./../../messages").cardGenerators;

const createAllUnhandledResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.ALL_UNHANDLED)
    .reprompt(messages.ALL_UNHANDLED)
    .getResponse();
};

createMoreStoreUnhandledResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.MORE_STORES_UNHANDLED)
    .reprompt(messages.MORE_STORES_UNHANDLED)
    .getResponse();
};

createMoreStoresStateUnhandledResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response
    .speak(messages.MORE_STORES_STATE_UNHANDLED)
    .reprompt(messages.MORE_STORES_STATE_UNHANDLED)
    .getResponse();
};

module.exports = {
  createAllUnhandledResponse,
  createMoreStoreUnhandledResponse,
  createMoreStoresStateUnhandledResponse
};
