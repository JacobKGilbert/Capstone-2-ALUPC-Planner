"use strict";

const db = require("../../db");
const User = require("../../models/user");
const { createToken } = require("../../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users")
  await db.query(`ALTER TABLE users ALTER COLUMN id RESTART WITH 1`)

  await User.register({
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
    isDeptHead: false
  });
  await User.register({
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
    isDeptHead: false
  });
  await User.register({
    firstName: "A1F",
    lastName: "A1L",
    email: "admin1@user.com",
    password: "password3",
    isAdmin: true,
    isDeptHead: false
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ id: 1, isAdmin: false, isDeptHead: false });
const u2Token = createToken({ id: 2, isAdmin: false, isDeptHead: false });
const adminToken = createToken({ id: 3, isAdmin: true, isDeptHead: false });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
