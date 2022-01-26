'use strict'

const { NotFoundError, BadRequestError } = require('../../expressError')
const db = require('../../db.js')
const Event = require('../event')

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require('./_testCommon')

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/************************************** create */

describe('create', function () {
  const date = new Date(2022, 6, 14)
  const dataWithoutPositions = {
    date
  }
  const positions = {
    'test': 1
  }
  const dataWithPositions = {
    date,
    positions
  }

  test('works: without positions', async function () {
    const event = await Event.create(dataWithoutPositions, 'ndh')

    expect(event).toEqual({
      id: 2,
      date: date,
      deptCode: 'ndh',
      schedule: {}
    })
  })

  test('works: with positions', async function () {
    const event = await Event.create(dataWithPositions, 'old')

    expect(event).toEqual({
      id: 3,
      date: date,
      deptCode: 'old',
      schedule: {
        'test': 1
      },
    })
  })

  test('fails: duplicate', async function () {
    const dupData = {
      date: new Date(2022, 6, 15)
    }
    try {
      await Event.create(dupData, 'old')
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

/************************************** get all events for user*/

describe('get all events for user', function () {
  test('works: with user having events', async function () {
    const events = await Event.getAllForUser(2)

    expect(events).toEqual([
      {
        id: 1,
        date: expect.any(Date),
        deptName: 'Old Department',
        formattedDate: 'Friday    July      15, 2022',
        positionName: 'Test Position'
      }
    ])
  })

  test('works: with user not having events', async function () {
    const events = await Event.getAllForUser(1)

    expect(events).toEqual([])
  })

  test('fails: incorrect user', async function () {
    try {
      const events = await Event.getAllForUser(0)
      fail()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})

// /************************************** get all for department */

describe('get all for department', function () {
  test('works', async function () {
    const events = await Event.getAllForDepartment('old')

    expect(events).toEqual([
      {
        id: 1,
        date: expect.any(Date)
      }
    ])
  })

  test('fails', async function () {
    try {
      await Event.getAllForDepartment('not')
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

// /************************************** get by id */

describe('get by id', function () {
  test('works', async function () {
    const event = await Event.get(1)
    expect(event).toEqual({
      id: 1,
      date: expect.any(Date),
      deptCode: 'old',
      users: [
        {
          id: 2,
          firstName: 'U2F',
          lastName: 'U2L',
          position: 'Test Position'
        }
      ]
    })
  })

  test('fails', async function () {
    try {
      const event = await Event.get(0)
      fail()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})

// /************************************** delete */

describe('delete', function () {
  test('works', async function () {
    const deletedEvent = await Event.delete(1)
    const found = await db.query(
      `SELECT id
       FROM events
       WHERE id = $1`,
      [1]
    )
    expect(deletedEvent).toEqual({
      id: 1,
    })
    expect(found.rows.length).toEqual(0)
  })

  test('fails', async function () {
    try {
      const deletedEvent = await Event.delete(0)
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})
