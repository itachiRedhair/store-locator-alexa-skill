const intents = require("./../constants").intents;
const deviceAddressClient = require("./../utilities/helper/deviceAdress.helper");
const responseTypes = require("./../constants").responseTypes;
const messages = require("./../messages");
const permission = require("./../constants").PERMISSIONS;
const states = require("./../constants").states;
const session = require("./../constants").session;
const {
  createMoreStoreResponse,
  createNearestStoreResponse,
  createAllNearbyStoreResponse
} = require("./../utilities/responseFactory/FindNearByStores");

const FindNearestStore = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === "IntentRequest" &&
      request.intent.name === intents.FindNearestStore
    );
  },

  async handle(handlerInput) {
    const { requestEnvelope, responseBuilder } = handlerInput;

    try {
      const addressResponse = await deviceAddressClient.getDeviceAddress(
        handlerInput
      );

      switch (addressResponse.type) {
        case responseTypes.CONSENT_TOKEN_NOT_FOUND:
          console.log(addressResponse);
          return responseBuilder
            .speak(messages.NOTIFY_MISSING_PERMISSIONS)
            .withAskForPermissionsConsentCard(
              permission.DEVICE_ADDRESS_PERMISSIONS
            )
            .getResponse();
          break;
        case responseTypes.ADDRESS_NOT_SET:
          console.log(addressResponse);
          return responseBuilder.speak(messages.NO_ADDRESS).getResponse();
          break;
        case responseTypes.ADDRESS_FOUND:
          console.log(addressResponse);
          const attributes = handlerInput.attributesManager.getSessionAttributes();
          attributes[session.STATE] = states.MORE_STORES_LIST;
          handlerInput.attributesManager.setSessionAttributes(attributes);
          try {
            return await createNearestStoreResponse(
              handlerInput,
              addressResponse.address
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

const FindAllNearbyStores = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === "IntentRequest" &&
      request.intent.name === intents.FindAllNearbyStores
    );
  },

  async handle(handlerInput) {
    const { requestEnvelope, responseBuilder } = handlerInput;
    const range = handlerInput.requestEnvelope.request.intent.slots.range.value;
    const storesCount =
      handlerInput.requestEnvelope.request.intent.slots.stores_count.value;

    try {
      const addressResponse = await deviceAddressClient.getDeviceAddress(
        handlerInput
      );

      switch (addressResponse.type) {
        case responseTypes.CONSENT_TOKEN_NOT_FOUND:
          console.log(addressResponse);
          return responseBuilder
            .speak(messages.NOTIFY_MISSING_PERMISSIONS)
            .withAskForPermissionsConsentCard(
              permission.DEVICE_ADDRESS_PERMISSIONS
            )
            .getResponse();
          break;
        case responseTypes.ADDRESS_NOT_SET:
          console.log(addressResponse);
          return responseBuilder.speak(messages.NO_ADDRESS).getResponse();
          break;
        case responseTypes.ADDRESS_FOUND:
          console.log(addressResponse);
          try {
            return await createAllNearbyStoreResponse(
              handlerInput,
              addressResponse.address,
              range,
              storesCount
            );
          } catch (error) {
            console.log("Error creating all nearby stores response", error);
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

const MoreStoresYes = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      attributes[session.STATE] == states.MORE_STORES_LIST &&
      request.type === "IntentRequest" &&
      request.intent.name === intents.AMAZON.YesIntent
    );
  },

  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes[session.STATE] = states.NO_STATE;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    return createMoreStoreResponse(handlerInput);
  }
};

const MoreStoresNo = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (
      attributes[session.STATE] == states.MORE_STORES_LIST &&
      request.type === "IntentRequest" &&
      request.intent.name === intents.AMAZON.NoIntent
    );
  },

  async handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes[session.STATE] = states.NO_STATE;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    const { requestEnvelope, responseBuilder } = handlerInput;
    return responseBuilder.speak(`Okay goodbye`).getResponse();
  }
};

module.exports = {
  FindNearestStore,
  MoreStoresYes,
  MoreStoresNo,
  FindAllNearbyStores
};
