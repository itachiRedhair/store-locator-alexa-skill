//messages
const messages = require("./../../messages");
const { getDefaultCard } = require("./../../messages").cardGenerators;
const { supportsDisplay } = require("./../helper/display.helper");

const createNoAddressResponse = handlerInput => {
  const response = handlerInput.responseBuilder;
  if (supportsDisplay(handlerInput)) {
    response.addRenderTemplateDirective(getDefaultCard());
  }
  return response.speak(messages.NO_ADDRESS).getResponse();
};

module.exports = { createNoAddressResponse };
