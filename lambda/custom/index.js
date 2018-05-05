const Alexa = require("ask-sdk");
const AWS = require("aws-sdk");

const LaunchRequestHandler = require("./handlers/LaunchRequest.handler");
const FindNearbyStoresHandler = require("./handlers/FindNearbyStores.handler");
const ErrorHandler = require("./handlers/Error.handler");

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler.NewSessionHandler,
    FindNearbyStoresHandler.FindNearestStore,
    FindNearbyStoresHandler.FindAllNearbyStores,
    FindNearbyStoresHandler.MoreStoresYes,
    FindNearbyStoresHandler.MoreStoresNo
  )
  .addErrorHandlers(
    ErrorHandler.GetAddressError,
    ErrorHandler.DefaultErrorHandler
  )
  .withTableName("TMobileStoreLocator")
  .withAutoCreateTable(true)
  .lambda();
