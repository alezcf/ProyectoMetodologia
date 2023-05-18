const username = encodeURIComponent('probandoMongo');
const password = encodeURIComponent('VqAFtT6QbTkpj4sX');
const cluster = 'cluster0.kllcv5b.mongodb.net';
const authSource = 'admin';
const authMechanism = 'SCRAM-SHA-1';

module.exports={
  URI: `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`
}
