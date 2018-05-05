const NewSessionHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.session.new ||
      handlerInput.requestEnvelope.request.type === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speechOutput = `Welcome to T Mobile Store Locator.`;
    const reprompt = "Welcome to T Mobile Store Locator.";
    console.log("here in launchrequest");
    console.log(handlerInput);
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  }
};

module.exports = { NewSessionHandler };
