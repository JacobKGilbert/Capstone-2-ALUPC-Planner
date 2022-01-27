'use strict'

const db = require('../db')
const {
  NotFoundError,
  BadRequestError,
} = require('../expressError')
const { sqlForPartialUpdate, updatePositionQuery } = require("../helpers/sql")

/** Related functions for Positions. */
class Position {
  /** Create a new position.
   * Accepts code (max length of four char), name, and deptCode (may not be null)
   */
  static async create({ code, name, deptCode }) {
    const duplicateCheck = await db.query(
      `SELECT code, name
       FROM positions
       WHERE code = $1`,
      [code]
    )

    if (duplicateCheck.rows[0])
      throw new BadRequestError('A position with that code already exists.')

    const result = await db.query(
      `INSERT INTO positions (code, name, dept_code)
       VALUES ($1, $2, $3)
       RETURNING code, name, dept_code AS "deptCode"`,
      [code, name, deptCode]
    )

    const position = result.rows[0]

    return position
  }

  static async getForUser(userId) {
    const userPositionsRes = await db.query(
      `SELECT p.code, p.name
       FROM positions AS p
       INNER JOIN user_position AS up
          ON up.position_code = p.code
       INNER JOIN users AS u
          ON u.id = up.user_id
       WHERE u.id = $1`,
      [userId]
    )

    const positions = userPositionsRes.rows.map((p) => p.name) || []

    return positions
  }

  static async getForDepartment(deptCode) {
    const positionResult = await db.query(
      `SELECT code, name
       FROM positions
       WHERE dept_code = $1`,
      [deptCode]
    )

    const positions =
      positionResult.rows.map((p) => {
        return { code: p.code, name: p.name }
      }) || []

    return positions
  }

  /** Update Position
   *  Data may include { name [str], deptCode [int] }
   *  Returns { code, name, deptCode }
   */
  static async update(code, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      deptCode: 'dept_code',
    })

    const position = await updatePositionQuery(code, setCols, values)

    return position
  }

  static async delete(code) {
    const result = await db.query(
      `DELETE 
       FROM positions
       WHERE code = $1
       RETURNING code`,
      [code]
    )
    const position = result.rows[0]

    if (!position) throw new NotFoundError(`No position with code: ${code}`)

    return position
  }
}

module.exports = Position
