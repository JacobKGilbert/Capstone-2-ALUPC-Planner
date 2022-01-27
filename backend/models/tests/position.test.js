'use strict'

const { NotFoundError, BadRequestError } = require('../../expressError')
const db = require('../../db.js')
const Position = require('../position')

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
  const newPos = {
    code: 'new',
    name: 'New Position',
    deptCode: 'ndh'
  }
  const oldPos = {
    code: 'test',
    name: 'Test Position',
    deptCode: 'old'
  }

  test('works', async function () {
    const position = await Position.create(newPos)

    expect(position).toEqual(newPos)
  })

  test('fails', async function () {
    try {
      const position = await Position.create(oldPos)
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

/************************************** get for user */

describe('get for user', function () {
  test('works: with data', async function () {
    const positions = await Position.getForUser(2)

    expect(positions).toEqual(['Test Position'])
  })

  test('works: without data', async function () {
    const positions = await Position.getForUser(1)

    expect(positions).toEqual([])
  })

  /** This should never happen due to this method only being used when the User class method for getting a user calls this function.
   *  This test is just to show what would happen if it was run separately.
   */
  test('works: non-existant user', async function () {
    const positions = await Position.getForUser(0)

    expect(positions).toEqual([])
  })
})

/************************************** get for department */

describe('get for department', function() {
  test('works: with data', async function () {
    const positions = await Position.getForDepartment('old')

    expect(positions).toEqual([
      {
        code: 'test',
        name: 'Test Position',
      },
    ])
  })

  test('works: without data', async function () {
    const positions = await Position.getForDepartment('ndh')

    expect(positions).toEqual([])
  })

  /** This should never happen due to this method only being used when the Department class method for getting a department calls this function.
   *  This test is just to show what would happen if it was run separately.
   */
  test('works: non-existant department', async function () {
    const positions = await Position.getForDepartment('not')

    expect(positions).toEqual([])
  })
})

/************************************** update */

describe('update', function () {
  const updateName = {
    name: 'newName',
  }
  const updateDeptCode = {
    deptCode: 'ndh'
  }
  const updateBoth = {
    name: 'newName',
    deptCode: 'ndh'
  }

  test('works: update name', async function () {
    const updatedPos = await Position.update('test', updateName)

    expect(updatedPos).toEqual({
      code: 'test',
      name: 'newName',
      deptCode: 'old'
    })
  })

  test('works: update department', async function () {
    const updatedPos = await Position.update('test', updateDeptCode)

    expect(updatedPos).toEqual({
      code: 'test',
      name: 'Test Position',
      deptCode: 'ndh',
    })
  })

  test('works: update both', async function () {
    const updatedPos = await Position.update('test', updateBoth)

    expect(updatedPos).toEqual({
      code: 'test',
      name: 'newName',
      deptCode: 'ndh',
    })
  })
  
  test('fails: wrong position code', async function () {
    try {
      const updatedPos = await Position.update('nope', updateBoth)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})

/************************************** delete */

describe('delete', function () {
  test('works', async function () {
    const deletedPos = await Position.delete('test')

    expect(deletedPos).toEqual({ code: 'test' })
  })

  test('fails', async function () {
    try {
      const deletedPos = await Position.delete('nope')
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})