const {
  setSession,
  getSession
} = require("./../utilities/helper/session.helper");

//response builders
const {
  createMoreStoresResponse,
  createNearestStoreResponse,
  createDetailsOfStoreResponse,
  createZipCodeInvalidResponse
} = require("./../utilities/responseFactory/nearbyStores.rfactory");
const {
  createExitResponse
} = require("./../utilities/responseFactory/general.rfactory");

//constants
const intents = require("./../constants").intents;
const states = require("./../constants").states;
const session = require("./../constants").session;

//messages
const messages = require("./../messages");

const GetZipCode = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return (
      request.type === intents.type.IntentRequest &&
      request.intent.name === intents.GetZipCode
    );
  },

  async handle(handlerInput) {
    const zipcode =
      handlerInput.requestEnvelope.request.intent.slots.zipcode.value;

    const zipcodeLength = (Math.log(zipcode) * Math.LOG10E + 1) | 0;
    if (zipcode && zipcodeLength === 5) {
      //building response based on zipcode
      try {
        setSession(handlerInput, session.STATE, states.STORES_INFO);
        setSession(handlerInput, session.STORES_CURRENT_INDEX, 1);
        setSession(handlerInput, session.SELECTED_STORE_INDEX, 0);
        return await createNearestStoreResponse(
          handlerInput,
          { postalCode: zipcode },
          10
        );
      } catch (error) {
        console.log("Error creating nearest store response", error);
        throw error;
      }
    } else {
      return createZipCodeInvalidResponse(handlerInput);
    }
  }
};

module.exports = { GetZipCode };
