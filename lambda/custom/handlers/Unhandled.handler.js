const {
  setSession,
  getSession
} = require("./../utilities/helper/session.helper");

//response builders
const {
  createAllUnhandledResponse,
  createMoreStoreUnhandledResponse,
  createMoreStoresStateUnhandledResponse
} = require("./../utilities/responseFactory/unhandled.rfactory");

//constants
const intents = require("./../constants").intents;
const states = require("./../constants").states;
const session = require("./../constants").session;

//messages
const messages = require("./../messages");

//All unhandled request will get here
const AllUnhandled = {
  canHandle(handlerInput) {
    return true;
  },

  handle(handlerInput) {
    return createAllUnhandledResponse(handlerInput);
  }
};

//When user says more stores but there ain't no more stores to show
const MoreStoresUnhandled = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = getSession(handlerInput);
    return (
      attributes[session.STATE] === states.NO_STATE &&
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.MoreStores
    );
  },

  handle(handlerInput) {
    return createMoreStoreUnhandledResponse(handlerInput);
  }
};

const MoreStoresStateUnhandled = {
  canHandle(handlerInput) {
    const attributes = getSession(handlerInput);
    return attributes[session.STATE] === states.STORES_INFO;
  },

  handle(handlerInput) {
    return createMoreStoresStateUnhandledResponse(handlerInput);
  }
};
module.exports = {
  AllUnhandled,
  MoreStoresUnhandled,
  MoreStoresStateUnhandled
};
