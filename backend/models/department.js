'use strict'

const db = require('../db')
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../expressError')
const User = require("../models/user")
const Position = require("../models/position")

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

  static async get(code) {
    const deptResult = db.query(
      `SELECT code, name, dept_head
       FROM departments
       WHERE code = $1`,
       [code]
    )
    const department = deptResult.rows[0]

    const eventResult = db.query(
      `SELECT id, date
       FROM events
       WHERE dept_code = $1`,
       [code]
    )

    department.events = 
      eventResult.rows.map((e) => {
        return {id: e.id, date: e.date}
      }) || []

    department.positions = Position.getForDepartment(code)
      
    department.voluteers = User.findAllVolunteers(code)

    return department
  }

  static async update() {

  }

  static async delete() {

  }
}

module.exports = Department;