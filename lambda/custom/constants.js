"use strict";

module.exports = Object.freeze({
  appId: "amzn1.ask.skill.c81e5295-e948-4784-9182-d7397200ec00",

  //dynamodb tables
  sessionTable: "sessionTable",

  states: { MORE_STORES_LIST: "_MORE_STORES_LIST" },

  session: {
    STATE: "_STATE",
    MORE_STORES_LIST: "_MORE_STORES_LIST"
  },

  responseTypes: {
    NO_STATE: "",
    ADDRESS_NOT_SET: "_ADDRESS_NOT_SET",
    ADDRESS_FOUND: "_ADDRESS_FOUND",
    CONSENT_TOKEN_NOT_FOUND: "_CONSENT_TOKEN_NOT_FOUND"
  },

  PERMISSIONS: {
    DEVICE_ADDRESS_PERMISSIONS: ["read::alexa:device:all:address"]
  },

  intents: {
    LaunchRequest: "LaunchRequest",
    FindNearestStore: "FindNearestStore",
    FindAllNearbyStores: "FindAllNearbyStores",

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
