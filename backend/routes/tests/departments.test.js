'use strict'

const request = require('supertest')

const db = require('../../db.js')
const app = require('../../app')
const Department = require('../../models/department')

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  deptHeadToken,
} = require('./_testCommon')

beforeAll(commonBeforeAll)
beforeEach(commonBeforeEach)
afterEach(commonAfterEach)
afterAll(commonAfterAll)

/************************************** POST /departments */

describe('POST /departments', function () {
  const newDept = {
    code: 'new',
    name: 'New Department',
    deptHead: 3,
  }

  test('works for admins', async function () {
    const resp = await request(app)
      .post('/departments')
      .send(newDept)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(201)
    expect(resp.body).toEqual({
      department: newDept,
    })
  })

  test('fails for non-admins', async function () {
    const resp = await request(app)
      .post('/departments')
      .send(newDept)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: bad data', async function () {
    const resp = await request(app)
      .post('/departments')
      .send({})
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/************************************** GET /departments */

describe('GET /departments', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .get('/departments')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      departments: [
        {
          code: 'old',
          name: 'Old Department',
          deptHead: {
            id: 4,
            firstName: 'D1F',
            lastName: 'D1L'
          },
        },
      ],
    })
  })

  test('fails for non-admins', async function () {
    const resp = await request(app)
      .get('/departments')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })
})

/************************************** GET /departments/:code */

describe('GET /departments/:code', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .get('/departments/old')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      department: {
        code: 'old',
        name: 'Old Department',
        deptHead: 4,
        events: expect.any(Array),
        positions: expect.any(Array),
        volunteers: expect.any(Array),
      },
    })
  })

  test('works for deptHead', async function () {
    const resp = await request(app)
      .get('/departments/old')
      .set('authorization', `Bearer ${deptHeadToken}`)
    expect(resp.body).toEqual({
      department: {
        code: 'old',
        name: 'Old Department',
        deptHead: 4,
        events: expect.any(Array),
        positions: expect.any(Array),
        volunteers: expect.any(Array),
      },
    })
  })

  test('fails: unauthorized user', async function () {
    const resp = await request(app)
      .get('/departments/old')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: wrong department code', async function () {
    const resp = await request(app)
      .get('/departments/not')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})

/************************************** PATCH /departments/:code */

describe('PATCH /departments/:code', function () {
  const updateName = {
    name: 'newName'
  }
  const updateDeptHead = {
    deptHead: 3
  }
  const updateBoth = {
    name: 'newName',
    deptHead: 3
  }

  test('works: update name', async function () {
    const resp = await request(app)
      .patch('/departments/old')
      .send(updateName)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      department: {
        code: 'old',
        name: 'newName',
        deptHead: 4
      },
    })
  })

  test('works: update department head', async function () {
    const resp = await request(app)
      .patch('/departments/old')
      .send(updateDeptHead)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      department: {
        code: 'old',
        name: 'Old Department',
        deptHead: 3
      },
    })
  })

  test('works: update both', async function () {
    const resp = await request(app)
      .patch('/departments/old')
      .send(updateBoth)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      department: {
        code: 'old',
        name: 'newName',
        deptHead: 3
      },
    })
  })

  test('fails: bad data', async function () {
    const resp = await request(app)
      .patch('/departments/old')
      .send({})
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
  
  test('fails: unauthorized user', async function () {
    const resp = await request(app)
      .patch('/departments/old')
      .send(updateBoth)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })
})

/************************************** DELETE /departments/:code */

describe('DELETE /departments/:code', function () {
  test('works for admins', async function () {
    const resp = await request(app)
      .delete('/departments/old')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      deleted: 'old'
    })
  })

  test('fails: unauthorized user', async function () {
    const resp = await request(app)
      .delete('/departments/old')
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: wrong department code', async function () {
    const resp = await request(app)
      .delete('/departments/not')
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(404)
  })
})

/************************************** POST /departments/:code/schedule */

describe('POST /departments/:code/schedule', function () {
  const newEvent = {
    date: new Date(2022, 6, 15),
    positions: {
      'test': 1
    }
  }

  test('works for admins', async function () {
    const resp = await request(app)
      .post('/departments/old/schedule')
      .send(newEvent)
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.body).toEqual({
      event: {
        id: 2,
        date: '2022-07-15T05:00:00.000Z',
        deptCode: 'old',
        schedule: {
          test: 1,
        },
      },
    })
  })

  test('works for department head', async function () {
    const resp = await request(app)
      .post('/departments/old/schedule')
      .send(newEvent)
      .set('authorization', `Bearer ${deptHeadToken}`)
    expect(resp.body).toEqual({
      event: {
        id: 3,
        date: '2022-07-15T05:00:00.000Z',
        deptCode: 'old',
        schedule: {
          test: 1,
        },
      },
    })
  })

  test('fails: unauthorized user', async function () {
    const resp = await request(app)
      .post('/departments/old/schedule')
      .send(newEvent)
      .set('authorization', `Bearer ${u1Token}`)
    expect(resp.statusCode).toEqual(401)
  })

  test('fails: duplicate data', async function () {
    const resp = await request(app)
      .post('/departments/old/schedule')
      .send({
        date: new Date(2022, 6, 16),
        positions: {
          test: 1,
        },
      })
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })

  test('fails: bad data', async function () {
    const resp = await request(app)
      .post('/departments/old/schedule')
      .send({})
      .set('authorization', `Bearer ${adminToken}`)
    expect(resp.statusCode).toEqual(400)
  })
})