const Alexa = require("ask-sdk");

const { getStores } = require("./../api/store-locator.api");
const { supportsDisplay } = require("./../helper/display.helper");
const { setSession, getSession } = require("./../helper/session.helper");

//messages
const messages = require("./../../messages");
const {
  getNearestStorePrompt,
  getSelectedStorePrompt,
  getNearestStoreReprompt,
  getMoreStoresPrompt,
  getDetailsOfStorePrompt
} = require("./../../messages").speechGenerators;
const {
  getStoreTemplateCard,
  getStoreTemplateList
} = require("./../../messages").cardGenerators;

//constants
const states = require("./../../constants").states;
const session = require("./../../constants").session;

const createNearestStoreResponse = async (handlerInput, address, range) => {
  try {
    const storeLocatorResponse = await getStores(address.postalCode, range);
    const storesCount = storeLocatorResponse.stores_count;
    const storesList = storeLocatorResponse.stores_list;

    const response = handlerInput.responseBuilder;

    setSession(handlerInput, session.MORE_STORES_LIST, storesList);

    if (storesCount > 0) {
      const store = storesList[0];

      let speechPrompt = getNearestStorePrompt(store);
      let speechReprompt =
        storesCount > 1 ? getNearestStoreReprompt(storesCount) : "";

      if (supportsDisplay(handlerInput)) {
        response.addRenderTemplateDirective(getStoreTemplateCard(store));
      }

      return response
        .speak(speechPrompt + " " + speechReprompt)
        .reprompt(speechReprompt)
        .withStandardCard(
          store.name,
          store.address.street + "\n" + store.address.city,
          `https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png`,
          `https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png`
        )
        .getResponse();
    } else {
      return response.speak(messages.NO_STORES_NEARBY).getResponse();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createMoreStoresResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  const attributes = getSession(handlerInput, session.MORE_STORES_LIST);
  const storesList = attributes[session.MORE_STORES_LIST];
  const storesCurrentIndex = getSession(handlerInput)[
    session.STORES_CURRENT_INDEX
  ];
  console.log(storesCurrentIndex);

  if (storesList.length > 0) {
    const speechPrompt = getMoreStoresPrompt(storesList, storesCurrentIndex);
    const speechReprompt = messages.SHOW_MORE_STORES;
    setSession(
      handlerInput,
      session.STORES_CURRENT_INDEX,
      storesCurrentIndex + 5
    );
    console.log(speechPrompt);

    if (supportsDisplay(handlerInput)) {
      response.addRenderTemplateDirective(getStoreTemplateList(storesList));
    }

    return response
      .speak(speechPrompt)
      .reprompt(speechReprompt)
      .getResponse();
  } else {
    return response.speak(messages.NO_STORES_NEARBY).getResponse();
  }
};

const createNoMoreStoresResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.NO_MORE_STORES)
    .reprompt(messages.NO_MORE_STORES)
    .getResponse();
};

const createDetailsOfStoreResponse = (handlerInput, store) => {
  const response = handlerInput.responseBuilder;

  const speechPrompt = getDetailsOfStorePrompt(store);
  const speechReprompt = messages.SHOW_MORE_STORES;

  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getStoreTemplateCard(store));
  }

  return response
    .speak(speechPrompt + " " + speechReprompt)
    .reprompt(speechReprompt)
    .getResponse();
};

const createZipCodeInvalidResponse = handlerInput => {
  const speechPrompt = messages.ZIPCODE_INVALID;
  return handlerInput.responseBuilder
    .speak(speechPrompt)
    .reprompt(speechPrompt)
    .getResponse();
};

const createSelectedStoreResponse = (handlerInput, store) => {
  const response = handlerInput.responseBuilder;

  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getStoreTemplateCard(store));
  }
  if (store) {
    const speechPrompt = getSelectedStorePrompt(store);
    const speechReprompt =
      messages.SHOW_MORE_STORES + " or " + messages.STORE_DETAILS;
    return response
      .speak(speechPrompt + " " + speechReprompt)
      .reprompt(speechReprompt)
      .withStandardCard(
        store.name,
        store.address.street + "\n" + store.address.city,
        `https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png`,
        `https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png`
      )
      .getResponse();
  } else {
    return response
      .speak(messages.INVALID_STORE_SELECTION)
      .reprompt(messages.INVALID_STORE_SELECTION)
      .getResponse();
  }
};

const createInvalidStoreSelectionResponse = handlerInput => {
  return handlerInput.responseBuilder
    .speak(messages.INVALID_STORE_SELECTION)
    .reprompt(messages.INVALID_STORE_SELECTION)
    .getResponse();
};

module.exports = {
  createMoreStoresResponse,
  createNearestStoreResponse,
  createDetailsOfStoreResponse,
  createZipCodeInvalidResponse,
  createSelectedStoreResponse,
  createInvalidStoreSelectionResponse,
  createNoMoreStoresResponse
};
