const bcrypt = require("bcrypt");

const db = require("../../db.js");
const { BCRYPT_WORK_FACTOR } = require("../../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query(`DELETE FROM users`)
  await db.query(`ALTER TABLE users ALTER COLUMN id RESTART WITH 1`)
  await db.query(`DELETE FROM unavailable`)
  await db.query(`ALTER TABLE unavailable ALTER COLUMN id RESTART WITH 1`)

  //Create test users
  await db.query(
    `INSERT INTO users(first_name,
                       last_name,
                       email,
                       password,
                       is_admin,
                       is_dept_head)
    VALUES ('U1F', 'U1L', 'u1@email.com', $1, false, false),
           ('U2F', 'U2L', 'u2@email.com', $2, false, false),
           ('A1F', 'A1L', 'a1@email.com', $3, true, false),
           ('D1F', 'D1L', 'd1@email.com', $4, false, true)
    RETURNING id`,
    [
      await bcrypt.hash('password1', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password2', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('adminPassword', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('deptHeadPassword', BCRYPT_WORK_FACTOR)
    ]
  )

  //Create unavailable
  const testDate = new Date(2022, 6, 16)
  await db.query(
    `INSERT INTO unavailable (user_id, date)
     VALUES ($1, $2)
     RETURNING id`,
     [1, testDate]
  )
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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};