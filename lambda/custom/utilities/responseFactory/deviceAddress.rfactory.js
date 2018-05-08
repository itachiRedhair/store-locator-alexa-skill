//messages
const messages = require("./../../messages");

const createNoAddressResponse = handlerInput => {
  return handlerInput.responseBuilder.speak(messages.NO_ADDRESS).getResponse();
};

module.exports = { createNoAddressResponse };
