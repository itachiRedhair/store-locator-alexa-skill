const deviceAddressClient = require("./../utilities/helper/deviceAdress.helper");
const {
  setSession,
  getSession
} = require("./../utilities/helper/session.helper");

//response builders
const {
  createMoreStoresResponse,
  createNearestStoreResponse,
  createDetailsOfStoreResponse
} = require("./../utilities/responseFactory/nearbyStores.rfactory");
const {
  createAskDevicePermissionResponse
} = require("./../utilities/responseFactory/permissions.rfactory");
const {
  createNoAddressResponse
} = require("./../utilities/responseFactory/deviceAddress.rfactory");
const {
  createExitResponse
} = require("./../utilities/responseFactory/general.rfactory");

//constants
const intents = require("./../constants").intents;
const permission = require("./../constants").PERMISSIONS;
const states = require("./../constants").states;
const responseTypes = require("./../constants").responseTypes;
const session = require("./../constants").session;

//messages
const messages = require("./../messages");

const FindNearestStore = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.FindNearestStore
    );
  },

  async handle(handlerInput) {
    const range = handlerInput.requestEnvelope.request.intent.slots.range.value;
    try {
      //getting address
      const addressResponse = await deviceAddressClient.getDeviceAddress(
        handlerInput
      );

      //building response based on device address fetch response
      switch (addressResponse.type) {
        case responseTypes.CONSENT_TOKEN_NOT_FOUND:
          return createAskDevicePermissionResponse(handlerInput);
          break;
        case responseTypes.ADDRESS_NOT_SET:
          return createNoAddressResponse(handlerInput);
          break;
        case responseTypes.ADDRESS_FOUND:
          try {
            setSession(handlerInput, session.STATE, states.STORES_INFO);
            setSession(handlerInput, session.STORES_CURRENT_INDEX, 1);
            return await createNearestStoreResponse(
              handlerInput,
              addressResponse.address,
              range
            );
          } catch (error) {
            console.log("Error creating nearest store response", error);
            throw error;
          }
          break;
        default:
          throw new Error("Error. Address Response type is invalid.");
      }
    } catch (error) {
      throw error;
    }
  }
};

const MoreStores = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = getSession(handlerInput);
    return (
      attributes[session.STATE] == states.STORES_INFO &&
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.MoreStores
    );
  },

  handle(handlerInput) {
    const attributes = getSession(handlerInput);
    const storesListIndex = attributes[session.STORES_CURRENT_INDEX];
    const storesList = attributes[session.MORE_STORES_LIST];
    if (storesList.length - storesListIndex < 5) {
      setSession(handlerInput, session.STATE, states.NO_STATE);
    }
    return createMoreStoresResponse(handlerInput);
  }
};

const DetailsOfStore = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = getSession(handlerInput);
    return (
      attributes[session.STATE] == states.STORES_INFO &&
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.DetailsOfStore
    );
  },

  handle(handlerInput) {
    const store = getSession(handlerInput)[session.MORE_STORES_LIST][0];
    return createDetailsOfStoreResponse(handlerInput, store);
  }
};

const SelectStore = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = getSession(handlerInput);
    return (
      attributes[session.STATE] == states.STORES_INFO &&
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.SelectStore
    );
  },

  handle(handlerInput) {
    const attributes = getSession(handlerInput);
    const storeIndex =
      handlerInput.requestEnvelope.request.intent.slots.storeIndex.value;
    const storesCurrentIndex = attributes[session.STORES_CURRENT_INDEX];
    const store =
      attributes[session.MORE_STORES_LIST][storeIndex + storesCurrentIndex - 1];
    return createNearestStoreResponse(handlerInput, store);
  }
};

module.exports = {
  FindNearestStore,
  MoreStores,
  DetailsOfStore,
  SelectStore
};
