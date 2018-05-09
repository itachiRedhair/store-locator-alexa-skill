const Alexa = require("ask-sdk");

//request handlers
const CommonHandler = require("./handlers/Common.handler");
const LaunchRequestHandler = require("./handlers/LaunchRequest.handler");
const FindNearbyStoresHandler = require("./handlers/FindNearbyStores.handler");
const GetZipCodeHandler = require("./handlers/GetZipCode.handler");
const ErrorHandler = require("./handlers/Error.handler");
const UnhandledHandler = require("./handlers/Unhandled.handler");

//skill instance
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler.NewSessionHandler,
    CommonHandler.StopHandler,
    CommonHandler.HelpHandler,
    GetZipCodeHandler.GetZipCode,
    FindNearbyStoresHandler.FindNearestStore,
    FindNearbyStoresHandler.MoreStores,
    FindNearbyStoresHandler.RepeatStoreList,
    FindNearbyStoresHandler.SelectStore,
    FindNearbyStoresHandler.DetailsOfStore,

    //all unhandled handlers here *Priority important*
    // UnhandledHandler.MoreStoresStateUnhandled,
    UnhandledHandler.MoreStoresUnhandled,
    UnhandledHandler.AllUnhandled
  )
  .addErrorHandlers(
    ErrorHandler.GetAddressError,
    ErrorHandler.DefaultErrorHandler
  )
  .lambda();
