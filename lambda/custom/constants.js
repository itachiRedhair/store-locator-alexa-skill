"use strict";

module.exports = Object.freeze({
  appId: "amzn1.ask.skill.c81e5295-e948-4784-9182-d7397200ec00",

  testEnvironment: process.env.TEST_ENVIRONMENT || "simulator",

  googleMapAPIToken: process.env.GOOGLE_MAP_API_TOKEN || "xxxxxxxxx",

  //dynamodb tables
  sessionTable: "CENSOREDSessionTable",

  error: {
    name: {
      SERVICE_ERROR: "ServiceError"
    },
    statusCode: {
      FORBIDDEN: 403
    }
  },

  states: {
    NO_STATE: "",
    STORES_INFO: "STORES_INFO"
  },

  session: {
    STATE: "_STATE",
    MORE_STORES_LIST: "_MORE_STORES_LIST",
    STORES_CURRENT_INDEX: "_STORES_CURRENT_INDEX",
    SELECTED_STORE_INDEX: "_SELECTED_STORE_INDEX"
  },

  responseTypes: {
    ADDRESS_NOT_SET: "_ADDRESS_NOT_SET",
    ADDRESS_FOUND: "_ADDRESS_FOUND",
    CONSENT_TOKEN_NOT_FOUND: "_CONSENT_TOKEN_NOT_FOUND"
  },

  PERMISSIONS: {
    DEVICE_ADDRESS_PERMISSIONS: ["read::alexa:device:all:address"]
  },

  intents: {
    type: {
      IntentRequest: "IntentRequest"
    },
    LaunchRequest: "LaunchRequest",
    GetZipCode: "GetZipCode",
    FindNearestStore: "FindNearestStore",
    MoreStores: "MoreStores",
    RepeatStoreList: "RepeatStoreList",
    DetailsOfStore: "DetailsOfStore",
    SelectStore: "SelectStore",

    AMAZON: {
      YesIntent: "AMAZON.YesIntent",
      NoIntent: "AMAZON.NoIntent",
      HelpIntent: "AMAZON.HelpIntent",
      StopIntent: "AMAZON.StopIntent",
      CancelIntent: "AMAZON.CancelIntent"
    },

    Unhandled: "Unhandled",
    SessionEndedRequest: "SessionEndedRequest"
  }
});
