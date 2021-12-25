'use strict'

const db = require('../db')
const {
  NotFoundError,
  BadRequestError,
} = require('../expressError')

/** Related functions for events. */
class Event {
  /** Create a new event.
   * Accepts date and deptCode
   * Returns Event { id, date, deptCode }
   */
  static async create(date, deptCode) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM events
       WHERE date = $1 AND deptCode = $2`,
      [date, deptCode]
    )

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `An event already exists for deptCode: ${deptCode} with date: ${date}.`
      )

    const result = await db.query(
      `INSERT INTO events (date, dept_code)
       VALUES ($1, $2)
       RETURNING date, dept_code AS deptCode`,
      [date, deptCode]
    )

    const event = result.rows[0]

    return event
  }

  static async getAllForUser(userId) {
    const userEventRes = await db.query(
      `SELECT e.id,
              TO_CHAR(e.date::DATE, 'Day Month DD, YYYY') AS "date",
              d.name AS "deptName",
              p.name AS "positionName"
       FROM events AS e
       INNER JOIN events_volunteers AS ev
          ON ev.event_id = e.id
       INNER JOIN users AS u
          ON u.id = ev.user_id
       INNER JOIN positions AS p
          ON p.code = ev.position_code
       INNER JOIN departments AS d
          ON d.code = e.dept_code
       WHERE u.id = $1 AND e.date >= CURRENT_DATE
       GROUP BY e.id, d.name, p.name
       ORDER BY e.date ASC`,
      [userId]
    )
    const events = userEventRes.rows.map((e) => {
      return {
        id: e.id,
        date: e.date,
        deptName: e.deptName,
        positionName: e.positionName
      }
    }) || []

    return events
  }

  static async getAllForDepartment(deptCode) {
    const eventResult = await db.query(
      `SELECT id, date
       FROM events
       WHERE dept_code = $1`,
      [deptCode]
    )

    const events =
      eventResult.rows.map((e) => {
        return { id: e.id, date: e.date }
      }) || []

    return events
  }

  /**
   * 
   * @param {int} id 
   * 
   * Returns { id, date, deptCode, users }
   *    Where users = { id, firstName, lastName, positionCode }
   */
  static async get(id) {
    const eventResult = await db.query(
      `SELECT id,
              date,
              dept_code AS "deptCode"
       FROM events
       WHERE id = $1`,
       [id]
    )
    const event = eventResult.rows[0]

    const userResult = await db.query(
      `SELECT u.id,
              u.first_name AS "firstName",
              u.last_name AS "lastName",
              p.name AS "position"
       FROM users AS u
       INNER JOIN events_volunteers AS ev
          ON ev.user_id = u.id
       INNER JOIN events AS e
          ON e.id = ev.event_id
       INNER JOIN positions AS p
          ON p.code = ev.position_code
       WHERE e.id = $1`,
       [id]
    )

    event.users = userResult.rows.map((u) => {
      return { 
        id: u.id, 
        firstName: u.firstName, 
        lastName: u.lastName, 
        position: u.position
      }
    })

    return event
  }

  static async update(id, data) {}

  static async delete(id) {
    const result = await db.query(
      `DELETE 
       FROM events
       WHERE id = $1
       RETURNING id`,
      [id]
    )
    const event = result.rows[0]

    if (!event) throw new NotFoundError(`No event with id: ${id}`)
  }
}

module.exports = Event
