"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate, updateUserQuery } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with email, password.
   *
   * Returns { first_name, last_name, email, isAdmin, isDeptHead }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              password,
              is_admin AS "isAdmin",
              is_dept_head AS "isDeptHead"
      FROM users
      WHERE email = $1`,
      [email]
    )

    const user = result.rows[0]

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password)
      if (isValid === true) {
        delete user.password
        return user
      }
    }

    throw new UnauthorizedError('Invalid username/password')
  }

  /** Register user with data.
   *
   * Returns { firstName, lastName, email, isAdmin, isDeptHead }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    firstName,
    lastName,
    email,
    password,
    isAdmin,
    isDeptHead,
  }) {
    const duplicateCheck = await db.query(
      `SELECT email
      FROM users
      WHERE email = $1`,
      [email]
    )

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`A user with that email already exists.`)
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

    const result = await db.query(
      `INSERT INTO users
           (first_name,
            last_name,
            email,
            password,
            is_admin,
            is_dept_head)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin", is_dept_head AS "isDeptHead"`,
      [firstName, lastName, email, hashedPassword, isAdmin, isDeptHead]
    )

    const user = result.rows[0]

    return user
  }

  /** Find all users.
   *
   * Returns [{ first_name, last_name, email, isAdmin, isDeptHead }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin",
              is_dept_head AS "isDeptHead"
      FROM users
      ORDER BY lastName DESC, firstName`
    )

    return result.rows
  }

  /** Find all users in given department.
   *
   * Returns [{ first_name, last_name, email, isAdmin, isDeptHead }, ...]
   **/

  static async findAllVolunteers(deptCode) {
    const result = await db.query(
      `SELECT u.id,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              u.email,
              u.is_admin AS "isAdmin",
              u.is_dept_head AS "isDeptHead"
      FROM users AS u
      INNER JOIN dept_volunteers AS dv
        ON dv.user_id = u.id
      INNER JOIN departments AS d
        ON d.code = dv.dept_code
      WHERE d.code = $1
      ORDER BY lastName DESC, firstName`,
      [deptCode]
    )

    return result.rows
  }

  /** Given a users id, return data about user.
   *
   * Returns { id, first_name, last_name, email isAdmin, isDeptHead, positions }
   *  where positions is [position.name]
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const userRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              is_admin AS "isAdmin",
              is_dept_head AS "isDeptHead"
      FROM users
      WHERE id = $1`,
      [id]
    )

    const user = userRes.rows[0]

    if (!user) throw new NotFoundError(`No user: ${id}`)

    const userPositionsRes = await db.query(
      `SELECT p.code, p.name
      FROM positions AS p
      INNER JOIN user_position AS up
        ON up.position_code = p.code
      INNER JOIN user AS u
        ON u.id = up.user_id
      WHERE id = $1`,
      [id]
    )

    user.positions = userPositionsRes.rows.map((p) => p.name)
    return user
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, email }
   *
   * Returns { firstName, lastName, email, isAdmin, isDeptHead }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if (data.password) delete data.password
    if (data.isAdmin) delete data.isAdmin
    if (data.isDeptHead) delete data.isDeptHead

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: 'first_name',
      lastName: 'last_name',
    })

    const user = updateUserQuery(id, setCols, values)

    if (!user) throw new NotFoundError(`No user: ${id}`)

    return user
  }

  /** Update user's password
   *
   * Returns { firstName, lastName, email, isAdmin, isDeptHead }
   * 
   * Throws either NotFoundError (if user not found) or UnauthorizedError (if incorrect password)
   */
  static async updatePassword(id, password, newPassword) {
    const userRes = await db.query(
      `SELECT id, password
       FROM users
       WHERE id = $1`,
      [id]
    )
    const user = userRes.rows[0]

    if (!user) throw new NotFoundError(`No user: ${id}`)

    const isValid = await bcrypt.compare(password, user.password)
    if (isValid === false)
      throw new UnauthorizedError('Invalid username/password')

    const newPasswordHash = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR)

    const data = { password: newPasswordHash, needsNewPwd: false }

    const { setCols, values } = sqlForPartialUpdate(data, {
      needsNewPwd: 'needs_new_pwd'
    })

    const updatedUser = updateUserQuery(id, setCols, values)

    return updatedUser
  }

  /** Update user to be admin and/or department head */
  static async updateUserToAdminOrDeptHead(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      isAdmin: 'is_admin',
      isDeptHead: 'is_dept_head',
    })
    const user = updateUserQuery(id, setCols, values)

    if (!user) throw new NotFoundError(`No user: ${id}`)

    return user
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
      FROM users
      WHERE id = $1
      RETURNING id`,
      [id]
    )
    const user = result.rows[0]

    if (!user) throw new NotFoundError(`No user: ${id}`)
  }
}


module.exports = User;
