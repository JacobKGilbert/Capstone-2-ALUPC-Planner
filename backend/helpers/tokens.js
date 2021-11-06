const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");
  console.assert(user.isDeptHead !== undefined,
      "createToken passed user without isDeptHead property");

  let payload = {
    id: user.id,
    isAdmin: user.isAdmin || false,
    isDeptHead: user.isDeptHead || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
