"use strict";

const db = require("../../db");
const User = require("../../models/user");
const Department = require('../../models/department')
const Position = require('../../models/position')
const Event = require('../../models/event')
const { createToken } = require("../../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users")
  await db.query(`ALTER TABLE users ALTER COLUMN id RESTART WITH 1`)
  await db.query(`DELETE FROM unavailable`)
  await db.query(`ALTER TABLE unavailable ALTER COLUMN id RESTART WITH 1`)
  await db.query(`DELETE FROM departments`)
  await db.query(`DELETE FROM positions`)
  await db.query(`DELETE FROM events`)
  await db.query(`ALTER TABLE events ALTER COLUMN id RESTART WITH 1`)

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
  await User.register({
    firstName: "D1F",
    lastName: "D1L",
    email: "deptHead1@user.com",
    password: "password4",
    isAdmin: false,
    isDeptHead: true
  });

  await Department.create({
    code: 'old',
    name: 'Old Department',
    deptHead: 4
  })

  await Position.create({
    code: 'test',
    name: 'Test Position',
    deptCode: 'old'
  })

  await Event.create({
    date: new Date(2022, 6, 16),
    positions: {
      'test': 1
    }
  }, 'old')

  const unvStartDate = new Date(2022, 6, 15)
  const unvEndDate = new Date(2022, 6, 15)
  await User.makeUnavailable(1, [unvStartDate, unvEndDate])
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
const deptHeadToken = createToken({ id: 4, isAdmin: false, isDeptHead: true})


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  deptHeadToken
};
