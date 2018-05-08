const Alexa = require("ask-sdk");
const {
  distanceFormat,
  removeSpecialCharacter,
  getStaticMapImage,
  truncateString
} = require("./utilities/helper/responseFormat.helper");

module.exports = Object.freeze({
  GREETING: "Welcome to T Mobile Store Locator.",

  START_HELP_MESSAGE:
    "Try saying find nearby stores. Or you can say find stores for zipcode nine eight zero nine three",

  ZIPCODE_INVALID:
    "This zip code is not valid. Ensure you are giving me zip code from US",

  NO_STORES_NEARBY:
    "No stores nearby your current address. Please check your zipcode under device setting in Alexa App.",

  SHOW_MORE_STORES: "You can say show me more stores.",

  NOTIFY_MISSING_PERMISSIONS:
    "You have not given this skill your permission for Device Address.",

  GENERIC_ERROR: "Looks like something went wrong.",

  EXIT: "Okay, see you next time.",

  LOCATION_FAILURE:
    "There was an error with the Device Address API. Please try again.",

  NO_ADDRESS:
    "It seems you have not set an address. You can set it in your device setting.",

  ALL_UNHANDLED:
    "Sorry, I couldn't understand that. Try saying find nearby stores",

  MORE_STORES_UNHANDLED:
    "Sorry, I don't have any stores to show. Try saying find nearby stores.",

  MORE_STORES_STATE_UNHANDLED:
    "Sorry, I didn't get that. Try saying show more stores",

  speechGenerators: {
    getNearestStorePrompt: store => {
      const { type, name, distance, address } = store;
      let prompt =
        "Nearest " +
        type +
        " store is " +
        name +
        " which is " +
        distanceFormat(distance) +
        " miles away. It is located at " +
        address.street +
        " in " +
        address.city +
        ".";
      prompt = removeSpecialCharacter(prompt);
      return prompt;
    },
    getNearestStoreReprompt: storesCount => {
      let prompt =
        "There are " +
        (storesCount - 1) +
        " more stores nearby. Say show more stores to know about them or you can ask for details of this store.";
      prompt = removeSpecialCharacter(prompt);
      return prompt;
    },
    getMoreStoresPrompt: (storesList, storesListIndex) => {
      let prompt = "Hmmm, so you have ";
      const storesLimit =
        storesList.length - storesListIndex < 5
          ? storesList.length - storesListIndex
          : 5;
      console.log(
        "storesLIstLength",
        storesList.length,
        "storesLimit",
        storesLimit
      );
      for (let i = storesListIndex; i < storesListIndex + storesLimit; i++) {
        console.log("inside getmorestoresprompt", i, storesList[i]);
        prompt +=
          storesList[i].name +
          (i === storesListIndex + storesLimit - 1 ? ". " : ", ");
      }
      const maxDistance =
        storesList[storesListIndex + storesLimit - 1].distance;
      prompt +=
        "All these stores are within " +
        Math.round(maxDistance * 100) / 100 +
        " miles.";
      if (storesList.length - storesListIndex >= 5) {
        prompt += " " + "You can say show me more stores.";
      }
      prompt = removeSpecialCharacter(prompt);
      return prompt;
    },
    getDetailsOfStorePrompt: store => {
      let prompt = "";
      const storeHours = store.metainfo.store_hours;
      const phoneNumber = store.metainfo.phone_number;
      if (storeHours) {
        prompt += "Store is open ";
        storeHours.forEach((hour, index) => {
          prompt += index === 0 ? "on " + hour + " " : "and on " + hour + " ";
        });
      }
      if (phoneNumber) {
        prompt += prompt === "" ? "" : ".";
        prompt +=
          " You can contact store on phone number " +
          '<say-as interpret-as="telephone">' +
          phoneNumber +
          "</say-as>";
      }
      prompt = removeSpecialCharacter(prompt);
      return prompt;
    }
  },

  cardGenerators: {
    getStoreTemplateCard: store => {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(
          `https://s3.amazonaws.com/t-mobile-alexa-skill/tMobileSkillBackground.jpeg`
        )
        .getImage();
      const storeImage = new Alexa.ImageHelper()
        .withDescription("Google Map")
        .addImageInstance(
          getStaticMapImage({
            lat: store.address.lat,
            lng: store.address.lng,
            storeType: store.type
          })
        )
        .getImage();

      const titleText = `<b><font size="3">${removeSpecialCharacter(
        store.name
      )}</font></b><br/>`;
      const distanceText =
        `<font size="1">(` +
        distanceFormat(store.distance) +
        ` miles away)</font><br/>`;

      const addressText =
        `<font size="2">` +
        store.address.street +
        `<br/>` +
        store.address.city +
        `, ` +
        store.address.state +
        ", " +
        store.address.zipcode +
        `</font><br/>`;
      const contactText =
        (store.metainfo.phone_number
          ? `<font size="2">Contact: ` + store.metainfo.phone_number
          : ``) + `</font>`;
      let hoursText = `<br/>`;
      if (store.metainfo.store_hours) {
        hoursText += `<font size="1">Store Hrs: </font> <br/>`;
        store.metainfo.store_hours.forEach(hour => {
          hoursText += `<font size="1">` + hour + `</font>` + "<br/>";
        });
      }

      const textContent = new Alexa.RichTextContentHelper()
        .withPrimaryText(titleText + distanceText)
        .withSecondaryText(addressText + contactText)
        .withTertiaryText(hoursText)
        .getTextContent();
      const cardTemplate = {
        type: "BodyTemplate3",
        token: "NearestStore",
        backButton: "VISIBLE",
        backgroundImage: bgImage,
        title: "T-Mobile",
        image: storeImage,
        textContent
      };
      return cardTemplate;
    },

    getStoreTemplateList: storesList => {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(
          `https://s3.amazonaws.com/t-mobile-alexa-skill/tMobileSkillBackground.jpeg`
        )
        .getImage();

      const listItems = [];

      storesList.forEach((store, index) => {
        const storeImage = new Alexa.ImageHelper()
          .addImageInstance(
            getStaticMapImage({
              lat: store.address.lat,
              lng: store.address.lng,
              storeType: store.type
            })
          )
          .getImage();
        const nameText =
          truncateString(removeSpecialCharacter(store.name), 25) + "<br/>";
        const distanceText =
          `<font size="1">(` +
          distanceFormat(store.distance) +
          " miles away)" +
          "</font>";
        const addressText =
          `<font size="2">` +
          truncateString(store.address.street, 25) +
          `</font>`;
        listItems.push({
          token: store.name,
          image: storeImage,
          textContent: new Alexa.RichTextContentHelper()
            .withPrimaryText(nameText + distanceText)
            .withSecondaryText(addressText)
            .getTextContent()
        });
      });
      const listTemplate = {
        type: "ListTemplate2",
        token: "NearbyStoreList",
        backButton: "VISIBLE",
        backgroundImage: bgImage,
        title: "List of Nearby Stores",
        listItems: listItems
      };
      return listTemplate;
    }
  }
});
