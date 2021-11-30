'use strict'

const db = require('../db')
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../expressError')

/** Related functions for departments. */
class Department {
  /** Create a new department.
   * Accepts code (max length of three char), name, and deptHead (may be null)
   */
  static async create(code, name, deptHead) {
    const duplicateCheck = db.query(
      `SELECT code, name
       FROM departments
       WHERE code = $1`,
      [code]
    )

    if (duplicateCheck.rows[0])
      throw new BadRequestError('A department with that code already exists.')

    const result = db.query(
      `INSERT INTO departments (code, name, dept_head)
       VALUES ($1, $2, $3)
       RETURNING code, name, dept_head AS deptHead`,
      [code, name, deptHead]
    )

    const department = result.rows[0]

    return department
  }

  static async getForUser(userId) {
    const userPositionsRes = await db.query(
      `SELECT p.code, p.name
       FROM positions AS p
       INNER JOIN user_position AS up
          ON up.position_code = p.code
       INNER JOIN users AS u
          ON u.id = up.user_id
       WHERE id = $1`,
       [userId]
    )

    const positions = userPositionsRes.rows.map((p) => p.name) || []

    return positions
  }

  static async getForDepartment(deptCode) {
    const positionResult = db.query(
      `SELECT code, name
       FROM positions
       WHERE dept_code = $1`,
      [code]
    )

    const positions =
      positionResult.rows.map((p) => {
        return { id: p.id, name: p.name }
      }) || []

    return positions
  }

  static async update() {}

  static async delete() {}
}

module.exports = Department
