const https = require("https");

const getStores = (zipcode, range) => {
  //default values for range and count
  const storeRange = range ? range : 50;
  const storeCount = 10;
  console.log("in store locator api", zipcode, storeRange, storeCount);

  return new Promise((resolve, reject) => {
    https
      .get(
        `https:/CENSORED-store-locator.herokuapp.com/alexa-get-stores?zipcode=${zipcode}&range=${storeRange}&count=${storeCount}`,
        response => {
          let data = "";

          response.on("data", chunk => {
            data += chunk;
          });

          response.on("end", () => {
            try {
              console.log(JSON.parse(data));
              resolve(JSON.parse(data));
            } catch (error) {
              console.log(error);
              throw error;
            }
          });
        }
      )
      .on("error", error => {
        reject(error);
      });
  });
};

module.exports = { getStores };
