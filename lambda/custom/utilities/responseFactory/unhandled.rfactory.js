const messages = require("./../../messages");

const createAllUnhandledResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.ALL_UNHANDLED)
    .reprompt(messages.ALL_UNHANDLED)
    .getResponse();
};

createMoreStoreUnhandledResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.MORE_STORES_UNHANDLED)
    .reprompt(messages.MORE_STORES_UNHANDLED)
    .getResponse();
};

createMoreStoresStateUnhandledResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.MORE_STORES_STATE_UNHANDLED)
    .reprompt(messages.MORE_STORES_STATE_UNHANDLED)
    .getResponse();
};

module.exports = {
  createAllUnhandledResponse,
  createMoreStoreUnhandledResponse,
  createMoreStoresStateUnhandledResponse
};
