const messages = require("./../../messages");
const responseType = require("./../../constants").responseTypes;

const simulatorTesting = true;

const getDeviceAddress = async handlerInput => {
  const {
    requestEnvelope,
    serviceClientFactory,
    responseBuilder
  } = handlerInput; //extract handlerInput

  const consentToken =
    requestEnvelope.context.System.user.permissions && //get consent token if it is available
    requestEnvelope.context.System.user.permissions.consentToken;
  if (!consentToken) {
    return { type: responseType.CONSENT_TOKEN_NOT_FOUND };
  }
  if (simulatorTesting === false) {
    try {
      const { deviceId } = requestEnvelope.context.System.device;
      const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
      const address = await deviceAddressServiceClient.getFullAddress(deviceId);

      console.log("Address successfully retrieved.");
      console.log(address);
      if (address.postalCode === null) {
        return { type: responseType.ADDRESS_NOT_SET };
      } else {
        return { type: responseType.ADDRESS_FOUND, address };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    return { type: responseType.ADDRESS_FOUND, address: { postalCode: 98101 } };
  }
};

module.exports = { getDeviceAddress };
