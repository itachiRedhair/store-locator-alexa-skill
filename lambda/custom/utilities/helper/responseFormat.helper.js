const googleMapAPIToken = require("./../../constants").googleMapAPIToken;

const distanceFormat = distance => Math.round(distance * 100) / 100;

const removeSpecialCharacter = line => line.replace(/\&/g, "and");

const getStaticMapImage = ({ lat, lng, storeType }) => {
  const storeTypeImageUrl =
    storeType === "RETAIL"
      ? `https://www.t-mobile.com/content/dam/t-mobile/storeLocator/tmobile-stores-default.png`
      : `https://www.t-mobile.com/content/dam/t-mobile/storeLocator/non-tmobile-stores-default.png`;
  return (
    "https://maps.googleapis.com/maps/api/staticmap?zoom=15&size=200x250&id=gme-tmobileusa3&key=" +
    googleMapAPIToken +
    "&markers=icon:" +
    storeTypeImageUrl +
    "%7C" +
    lat +
    "," +
    lng
  );
};

const truncateString = (string, maxLength) =>
  string.substr(0, maxLength - 1) + (string.length > maxLength ? "..." : "");

module.exports = {
  distanceFormat,
  removeSpecialCharacter,
  getStaticMapImage,
  truncateString
};
