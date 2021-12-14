"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate, updateUserQuery, getUnavailable } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const Position = require("../models/position")
const Event = require("../models/event")

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
              needs_new_pwd AS "needsNewPwd",
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
      RETURNING id, 
                first_name AS "firstName", 
                last_name AS "lastName", 
                email, 
                needs_new_pwd AS "needsNewPwd", 
                is_admin AS "isAdmin", 
                is_dept_head AS "isDeptHead"`,
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
              needs_new_pwd AS "needsNewPwd",
              is_admin AS "isAdmin",
              is_dept_head AS "isDeptHead"
      FROM users
      ORDER BY last_name, first_name`
    )

    return result.rows
  }

  /** Find all users in given department.
   *
   * Returns [{ id, first_name, last_name, email, isAdmin, isDeptHead }, ...]
   **/

  static async findAllVolunteers(deptCode) {
    const result = await db.query(
      `SELECT u.id,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              u.email
      FROM users AS u
      INNER JOIN dept_volunteers AS dv
        ON dv.user_id = u.id
      INNER JOIN departments AS d
        ON d.code = dv.dept_code
      WHERE d.code = $1
      ORDER BY lastName DESC, firstName`,
      [deptCode]
    )

    for (const row of result.rows) {
      const userId = row.id

      row.positions = await Position.getForUser(userId)

      row.events = await Event.getAllForUser(userId)

      row.unavailable = await getUnavailable(userId)
    }

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
              needs_new_pwd AS "needsNewPwd",
              is_admin AS "isAdmin",
              is_dept_head AS "isDeptHead"
      FROM users
      WHERE id = $1`,
      [id]
    )

    const user = userRes.rows[0]

    if (!user) throw new NotFoundError(`No user: ${id}`)

    user.positions = await Position.getForUser(id)

    user.events = await Event.getAllForUser(id)

    user.unavailable = await getUnavailable(id)

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

    const user = await updateUserQuery(id, setCols, values)

    return user
  }

  /** Update user's password
   *
   * This method should only be used to change from a known password to a new one.
   *
   * DO NOT use if original password is "forgotten".
   *
   * Returns { firstName, lastName, email, isAdmin, isDeptHead }
   *
   * Throws either NotFoundError (if user not found) or UnauthorizedError (if incorrect password)
   */
  static async updatePassword(id, data) {
    const { password, newPassword } = data
    if (!password) throw new BadRequestError('Invalid Data')
    if (!newPassword || newPassword.length === 0) 
      throw new BadRequestError('Invalid Data')

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

    const newData = { password: newPasswordHash, needsNewPwd: false }

    const { setCols, values } = sqlForPartialUpdate(newData, {
      needsNewPwd: 'needs_new_pwd',
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
    const user = await updateUserQuery(id, setCols, values)

    if (!user) throw new NotFoundError(`No user: ${id}`)

    return user
  }

  /** Set user as unavailable. */
  static async makeUnavailable(userId, dates) {
    let user = await db.query(
      `SELECT id, email
       FROM users
       WHERE id = $1`,
       [userId]
    )

    if (!user.rows[0]) throw new NotFoundError(`No user: ${userId}`)

    const getDaysArray =  (start, end) => {
      const daysArr = []
      for (let dt = new Date(start); 
           dt <= new Date(end); 
           dt.setDate(dt.getDate() + 1)
      ) {
        daysArr.push(new Date(dt))
      }
      return daysArr
    }
    
    if (dates[0] !== dates[1]) {
      const daysArr = getDaysArray(dates[0], dates[1])

      for (const day of daysArr) {
        await db.query(
          `INSERT INTO unavailable (date, user_id)
           VALUES ($1, $2)
           RETURNING id
          `,
          [day, userId]
        )
      }
      return
    } else {
      await db.query(
        `INSERT INTO unavailable (date, user_id)
         VALUES ($1, $2)
         RETURNING id
        `,
        [dates[0], userId]
      )
      return
    }
  }

  /** Set user as available. */
  static async makeAvailable(id) {
    let result = await db.query(
      `DELETE FROM unavailable
       WHERE id = $1
       RETURNING id
      `,
      [id]
    )

    if (!result.rows[0]) 
      throw new NotFoundError(`No unavailable date with id of ${id}`)

    return result.rows[0]
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
