'use strict'

const { NotFoundError, BadRequestError } = require('../../expressError')
const db = require('../../db.js')
const Department = require('../department')

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
  const newDeptWithDeptHead = {
    code: 'new',
    name: 'New Dept',
    deptHead: 1
  }
  const newDeptWithoutDeptHead = {
    code: 'new',
    name: 'New Dept',
    deptHead: null
  }
  const duplDept = {
    code: 'old',
    name: 'Old Department',
    deptHead: null
  }

  test('works: with deptHead', async function () {
    const dept = await Department.create(newDeptWithDeptHead)

    expect(dept).toEqual(newDeptWithDeptHead)
  })

  test('works: without deptHead', async function () {
    const dept = await Department.create(newDeptWithoutDeptHead)

    expect(dept).toEqual(newDeptWithoutDeptHead)
  })

  test('fails: duplicate code', async function () {
    try {
      await Department.create(duplDept)
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

/************************************** get all */

describe('get all', function () {
  test('works', async function () {
    const depts = await Department.getAll()

    expect(depts).toEqual([
      {
        code: 'old',
        name: 'Old Department',
        deptHead: {
          id: 4,
          firstName: 'D1F',
          lastName: 'D1L',
        },
      },
      {
        code: 'ndh',
        name: 'No Department Head',
        deptHead: null
      }
    ])
  })
})

/************************************** get by code */

describe('get by code', function () {
  test('works', async function () {
    const dept = await Department.get('old')

    expect(dept).toEqual(
      {
        code: 'old',
        name: 'Old Department',
        deptHead: 4,
        events: expect.any(Array),
        positions: expect.any(Array),
        volunteers: expect.any(Array)
      },
    )
  })

  test('fails', async function () {
    try {
      await Department.get('not')
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

/************************************** get deptHead */

describe('get department head', function () {
  test('works', async function () {
    const deptHead = await Department.getDeptHead('old')
    expect(deptHead).toEqual({
      id: 4,
      firstName: 'D1F',
      lastName: 'D1L',
    })
  })

  test('works', async function () {
    const deptHead = await Department.getDeptHead('ndh')
    expect(deptHead).toEqual(null)
  })
})

/************************************** update */

describe('update', function () {
  const dataChangeDeptHead = {
    deptHead: 1
  }
  const dataChangeName = {
    name: 'New Name'
  }

  test('works: deptHead changed', async function () {
    const updatedDepartment = await Department.update('ndh', dataChangeDeptHead)
    expect(updatedDepartment).toEqual({
      code: 'ndh',
      name: 'No Department Head',
      deptHead: 1
    })
  })

  test('works: deptHead changed', async function() {
    const updatedDepartment = await Department.update('ndh', dataChangeName)
    expect(updatedDepartment).toEqual({
      code: 'ndh',
      name: 'New Name',
      deptHead: null
    })
  })

  test('fails', async function () {
    try {
      const updatedDepartment = await Department.update('not', dataChangeName)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})

/************************************** delete */

describe('delete', function () {
  test('works', async function () {
    const deletedDept = await Department.delete('ndh')
    const found = await db.query(
      `SELECT code
       FROM departments
       WHERE code = $1`,
       ['ndh']
    )
    expect(deletedDept).toEqual({
      code: 'ndh'
    })
    expect(found.rows.length).toEqual(0)
  })

  test('fails', async function () {
    try {
      const deletedDept = await Department.delete('not')
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})