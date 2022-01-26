const bcrypt = require("bcrypt");

const db = require("../../db.js");
const { BCRYPT_WORK_FACTOR } = require("../../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query(`DELETE FROM users`)
  await db.query(`ALTER TABLE users ALTER COLUMN id RESTART WITH 1`)
  await db.query(`DELETE FROM unavailable`)
  await db.query(`ALTER TABLE unavailable ALTER COLUMN id RESTART WITH 1`)
  await db.query(`DELETE FROM departments`)
  await db.query(`DELETE FROM positions`)
  await db.query(`DELETE FROM events`)
  await db.query(`ALTER TABLE events ALTER COLUMN id RESTART WITH 1`)

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
  const testStartDate = new Date(2022, 6, 16)
  const testEndDate = new Date(2022, 6, 17)
  await db.query(
    `INSERT INTO unavailable (user_id, start_date, end_date)
     VALUES ($1, $2, $3)
     RETURNING id`,
     [1, testStartDate, testEndDate]
  )

  //Create Departments
  await db.query(
    `INSERT INTO departments (code, name, dept_head)
       VALUES ($1, $2, $3)
       RETURNING code`,
    ['old', 'Old Department', 4]
  )
  await db.query(
    `INSERT INTO departments (code, name, dept_head)
       VALUES ($1, $2, $3)
       RETURNING code`,
    ['ndh', 'No Department Head', null]
  )

  //Create Positions
  await db.query(
    `INSERT INTO positions (code, name, dept_code)
     VALUES ($1, $2, $3)`,
     ['test', 'Test Position', 'old']
  )

  await db.query(
    `INSERT INTO events (date, dept_code)
     VALUES ($1, $2)`,
     [new Date(2022, 6, 15), 'old']
  )

  await db.query(
    `INSERT INTO events_volunteers (user_id, event_id, position_code)
     VALUES ($1, $2, $3)`,
     [2, 1, 'test']
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