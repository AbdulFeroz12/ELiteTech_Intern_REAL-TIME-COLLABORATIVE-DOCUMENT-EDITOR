// simple id generator
const crypto = require('crypto');

function makeId(len = 9) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

module.exports = { makeId };
