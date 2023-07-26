require('dotenv').config();
const username = encodeURIComponent(process.env.USERNAMEBD);
const password = encodeURIComponent(process.env.PASSWORD);
const cluster = process.env.CLUSTER;
const authSource = process.env.AUTH_SOURCE;
const authMechanism = process.env.AUTH_MECHANISM;

module.exports = {
  URI: `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`,
};