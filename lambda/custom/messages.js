const Alexa = require("ask-sdk");
const {
  distanceFormat,
  removeSpecialCharacter,
  getStaticMapImage,
  truncateString
} = require("./utilities/helper/responseFormat.helper");

module.exports = Object.freeze({
  GREETING:
    "<prosody rate='93%'>Well hello there!</prosody> Welcome to the T Mobile Store Locator.",

  START_HELP_MESSAGE: `Okay, so you can try saying <prosody rate='93%'>find nearby stores</prosody>. Or you can say somethig like <prosody rate='93%'>find stores for zipcode nine eight zero nine three</prosody>.`,

  INSTRUCTIONS: `Okay, so as you know, I am a store locator. I can help you find nearest store according to your device location. You can also say something like <prosody rate='93%'>find stores for zipcode nine eight zero nine three</prosody>. You can ask for more details of a particular store or opt for more stores. To get you going, try saying <prosody rate='93%'>find nearby stores</prosody>.`,

  ZIPCODE_INVALID:
    "Oh snap! Looks like this zip code is not a valid one. Can you please provide a zip code from the United States?",

  NO_STORES_NEARBY:
    "Oh no! It seems you don't have any stores near your current address. Can you please make sure your zipcode is valid?",

  SHOW_MORE_STORES: `Try saying <prosody rate='93%'>show more stores</prosody>.`,

  NO_MORE_STORES: "This is all I have for you right now.",

  STORE_DETAILS: "You can ask for the details of this store.",

  INVALID_STORE_SELECTION:
    "I don't think that is a valid option! Try saying a number of corresponding store or you can ask for more stores.",

  NOTIFY_MISSING_PERMISSIONS: `Looks like I don't have a permission for your Device Address. You should be seeing a prompt on your Alexa App. Please click on <prosody rate='93%'>Manage Permission</prosody> and change the setting accordingly.`,

  GENERIC_ERROR: `Oh snap! Looks like something went wrong. Try saying <prosody rate='93%'>find nearby stores</prosody>. If you still face the same problem, please check again later.`,

  EXIT: "Okay, until next time then!",

  LOCATION_FAILURE: `Hmmm, Apparently I have an issue getting your Device Address. Okay, let's try saying somethig like <prosody rate='93%'>find stores for zipcode nine eight zero nine three</prosody>.`,

  NO_ADDRESS:
    "Okay, I think you have not set an address. Try setting it in your device settings.",

  ALL_UNHANDLED: `Oh snap! I couldn't understand that. Try saying <prosody rate='93%'>find nearby stores</prosody>.`,

  MORE_STORES_UNHANDLED: `Woah! I don't have any stores to show. Try saying <prosody rate='93%'>find nearby stores</prosody>.`,

  MORE_STORES_STATE_UNHANDLED: `Sorry, I don't think I understand that. Try saying <prosody rate='93%'>find nearby stores</prosody>.`,

  speechGenerators: {
    getNearestStorePrompt: store => {
      const { type, name, distance, address } = store;
      let prompt =
        "Okay! So the nearest " +
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
    getSelectedStorePrompt: store => {
      const { type, name, distance, address } = store;
      let prompt =
        name +
        " is a " +
        type +
        " store which is " +
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
          (i === storesListIndex + storesLimit - 1 ? ". " : ",<break time='1s'/> ");
      }
      const maxDistance =
        storesList[storesListIndex + storesLimit - 1].distance;
      prompt +=
        "All these stores are within " +
        Math.round(maxDistance * 100) / 100 +
        " miles. ";
      if (storesList.length - storesListIndex >= 5) {
        prompt +=
          " " +
          "You can say show me more stores. Or you can say a number from one to five for particular store's details.";
      } else {
        const storeSelectionLimit = storesList.length - storesListIndex;
        prompt +=
          "You can say a number from one to " +
          storeSelectionLimit +
          " for particular store's details.";
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
          "</say-as>.";
      }
      prompt = removeSpecialCharacter(prompt);
      return prompt;
    }
  },

  cardGenerators: {
    getDefaultCard: () => {
      const bgImage = new Alexa.ImageHelper()
        .addImageInstance(
          "https://s3.amazonaws.com/t-mobile-alexa-skill/tMobileSkillBackground.jpeg"
        )
        .getImage();
      const tmobileLogo = new Alexa.ImageHelper()
        .withDescription("Google Map")
        .addImageInstance(
          "https://cdn.macrumors.com/article-new/2016/10/tmobile-fcc.jpg"
        )
        .getImage();

      const titleText = `<font size="7">T-Mobile</font><br/>`;
      const hintText = "<i>Try saying, 'Find nearby stores'</i>";
      const textContent = new Alexa.RichTextContentHelper()
        .withPrimaryText(titleText)
        .withSecondaryText(hintText)
        .withTertiaryText("")
        .getTextContent();
      const cardTemplate = {
        type: "BodyTemplate3",
        token: "Homepage",
        backButton: "VISIBLE",
        backgroundImage: bgImage,
        title: "T-Mobile",
        image: tmobileLogo,
        textContent
      };
      return cardTemplate;
    },

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
