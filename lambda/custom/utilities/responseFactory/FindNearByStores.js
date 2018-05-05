const { getStores } = require("./../api/store-locator.api");
const states = require("./../../constants").states;
const session = require("./../../constants").session;
const { supportsDisplay } = require("./../helper/display.helper");
const Alexa = require("ask-sdk");

const createNearestStoreResponse = async (handlerInput, address) => {
  try {
    const storeLocatorResponse = await getStores(address.postalCode);
    const storesCount = storeLocatorResponse.stores_count;
    const storesList = storeLocatorResponse.stores_list;

    const response = handlerInput.responseBuilder;

    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes[session.MORE_STORES_LIST] = storesList;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    if (storesCount > 0) {
      const store = storesList[0];
      let speechPrompt = `Nearest ${store.type} store is 
        ${store.name} which is 
        ${Math.round(store.distance * 100) / 100} miles away. It is located at 
        ${store.address.street} in ${store.address.city}.`;
      let speechReprompt =
        storesCount > 1
          ? ` There are ${storesCount - 1}more stores nearby. 
            Do you want to know about them too?`
          : "";
      if (supportsDisplay(handlerInput)) {
        const image = new Alexa.ImageHelper()
          .addImageInstance(
            `https://www.maxpixel.net/static/photo/1x/Abstract-Art-Fractal-Wallpaper-Digital-3198939.jpg`
          )
          .getImage();
        const primaryText = new Alexa.RichTextContentHelper()
          .withPrimaryText(store.address.street + " " + store.address.city)
          .getTextContent();
        response.addRenderTemplateDirective({
          type: "BodyTemplate2",
          token: "NearestStore",
          backButton: "visible",
          backgroundImage: image,
          title: store.name,
          textContent: primaryText
        });
      }
      return response
        .speak(speechPrompt + speechReprompt)
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
        .speak(
          `No stores nearby your current address. Please check your zipcode under device setting in Alexa App.`
        )
        .getResponse();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createMoreStoreResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const storesList = attributes[session.MORE_STORES_LIST];
  attributes[session.MORE_STORES_LIST] = {};
  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (storesList.length > 0) {
    let speechPrompt = "";
    let listItems = [];
    storesList.forEach(store => {
      speechPrompt += `You can go to ${store.name} which is ${Math.round(
        store.distance * 100
      ) / 100} miles away. It is located at ${store.address.street} in ${
        store.address.city
      }.`;
      listItems.push({
        token: store.name,
        textContent: new Alexa.PlainTextContentHelper()
          .withPrimaryText(store.name)
          .getTextContent()
      });
    });
    speechPrompt = speechPrompt.replace(/\&/g, "and");
    console.log(speechPrompt);

    if (supportsDisplay(handlerInput)) {
      const image = new Alexa.ImageHelper()
        .addImageInstance(
          `https://www.maxpixel.net/static/photo/1x/Abstract-Art-Fractal-Wallpaper-Digital-3198939.jpg`
        )
        .getImage();

      response.addRenderTemplateDirective({
        type: "ListTemplate1",
        token: "NearbyStoreList",
        backButton: "visible",
        backgroundImage: image,
        title: "List of Nearby Stores",
        listItems: listItems
      });
    }

    return response.speak(speechPrompt).getResponse();
  } else {
    return response.speak(messages.GENERIC_ERROR).getResponse();
  }
};

const createAllNearbyStoreResponse = async (
  handlerInput,
  address,
  range,
  count
) => {
  try {
    const storeLocatorResponse = await getStores(
      address.postalCode,
      range,
      count
    );
    const storesCount = storeLocatorResponse.stores_count;
    const storesList = storeLocatorResponse.stores_list;

    if (storesCount > 0) {
      let speechPrompt = "";
      storesList.forEach(store => {
        speechPrompt += `You can go to ${store.name} which is ${Math.round(
          store.distance * 100
        ) / 100} miles away. It is located at ${store.address.street} in ${
          store.address.city
        }.`;
      });
      speechPrompt = speechPrompt.replace(/\&/g, "and");
      console.log(speechPrompt);
      return handlerInput.responseBuilder.speak(speechPrompt).getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(messages.GENERIC_ERROR)
        .getResponse();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createMoreStoreResponse,
  createNearestStoreResponse,
  createAllNearbyStoreResponse
};
