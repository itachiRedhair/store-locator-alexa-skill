//constants
const responseType = require("./../../constants").responseTypes;
const testEnvironment = require("./../../constants").testEnvironment;

//return address response containing type of response and address payload
const getDeviceAddress = async handlerInput => {
  const { requestEnvelope, serviceClientFactory } = handlerInput; //extract handlerInput

  const consentToken =
    requestEnvelope.context.System.user.permissions && //get consent token if it is available
    requestEnvelope.context.System.user.permissions.consentToken;
  if (!consentToken) {
    return { type: responseType.CONSENT_TOKEN_NOT_FOUND };
  }

  if (testEnvironment !== "simulator") {
    try {
      const { deviceId } = requestEnvelope.context.System.device;
      const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
      const address = await deviceAddressServiceClient.getFullAddress(deviceId);

      console.log("Address successfully retrieved.");
      console.log(address);
      if (!address.postalCode) {
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
