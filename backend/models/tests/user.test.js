"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");
const db = require("../../db.js");
const User = require("../user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1@email.com", "password1");
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: "U1F",
      lastName: "U1L",
      email: "u1@email.com",
      needsNewPwd: true,
      isAdmin: false,
      isDeptHead: false
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope@email.com", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1@email.com", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    isAdmin: false,
    isDeptHead: false
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual({
      ...newUser,
      needsNewPwd: true,
      id: expect.any(Number)
    });
    const found = await db.query("SELECT * FROM users WHERE email = 'test@test.com'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].is_dept_head).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ 
      ...newUser, 
      isAdmin: true, 
      id: expect.any(Number), 
      needsNewPwd: true 
    });
    const found = await db.query("SELECT * FROM users WHERE email = 'test@test.com'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: expect.any(Number),
        firstName: 'A1F',
        lastName: 'A1L',
        email: 'a1@email.com',
        needsNewPwd: true,
        isAdmin: true,
        isDeptHead: false,
      },
      {
        id: expect.any(Number),
        firstName: 'D1F',
        lastName: 'D1L',
        email: 'd1@email.com',
        needsNewPwd: true,
        isAdmin: false,
        isDeptHead: true,
      },
      {
        id: expect.any(Number),
        firstName: 'U1F',
        lastName: 'U1L',
        email: 'u1@email.com',
        needsNewPwd: true,
        isAdmin: false,
        isDeptHead: false,
      },
      {
        id: expect.any(Number),
        firstName: 'U2F',
        lastName: 'U2L',
        email: 'u2@email.com',
        needsNewPwd: true,
        isAdmin: false,
        isDeptHead: false,
      },
    ])
  });
});

/************************************** get */

describe("get", function () {
  const newUser = {
      firstName: 'test get',
      lastName: 'User',
      email: 'testgetuser@test.com',
      isAdmin: false,
      isDeptHead: false,
    }
    
  test("works", async function () {
    await User.register({
      ...newUser,
      password: 'password',
    })
    let userId = await db.query(`SELECT id FROM users WHERE email=$1`, [
      'testgetuser@test.com',
    ])

    let user = await User.get(userId.rows[0].id);
    expect(user).toEqual({
      id: expect.any(Number),
      firstName: 'test get',
      lastName: 'User',
      email: 'testgetuser@test.com',
      needsNewPwd: true,
      isAdmin: false,
      isDeptHead: false,
      positions: expect.any(Array),
      events: expect.any(Array),
      unavailable: expect.any(Array)
    })
  });

  test("not found if no such user", async function () {
    try {
      await User.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewL",
    email: "new@email.com",
  };

  test("works", async function () {
    let user = await User.update(1, updateData);
    expect(user).toEqual({
      id: 1,
      needsNewPwd: true,
      isAdmin: false,
      isDeptHead: false,
      ...updateData,
    });
  });

  test("fails: new password, made isAdmin and isDeptHead", async function () {
    try {
      await User.update(1, {
        password: 'new',
        isAdmin: true,
        isDeptHead: true,
      })
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.update(0, {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update password */

describe("update password", function () {
  test("works", async function () {
    const data = {
      password: 'password1',
      newPassword: 'newPassword1'
    }
    const user = await User.updatePassword(1, data)

    expect(user).toEqual({
      id: 1,
      firstName: 'U1F',
      lastName: 'U1L',
      email: 'u1@email.com',
      needsNewPwd: false,
      isAdmin: false,
      isDeptHead: false
    })
    const found = await db.query("SELECT * FROM users WHERE id = 1")
    expect(found.rows.length).toEqual(1)
    expect(found.rows[0].password.startsWith('$2b$')).toEqual(true)
  })

  test('fails: no such user', async function () {
    const badData = {
      password: 'password1',
      newPassword: 'newPassword1',
    }
    try {
      const user = await User.updatePassword(0, badData)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })

  test("fails: bad password", async function () {
    const badData = {
      password: 'badPassword1',
      newPassword: 'newPassword1'
    }
    try {
      const user = await User.updatePassword(1, badData)
      fail()
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy()
    }
  })

  test('fails: no password', async function () {
    const badData = {
      newPassword: 'newPassword1',
    }
    try {
      const user = await User.updatePassword(1, badData)
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })

  test('fails: no newPassword', async function () {
    const badData = {
      password: 'password1',
    }
    try {
      const user = await User.updatePassword(1, badData)
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })

  test('fails: empty newPassword string', async function () {
    const badData = {
      password: 'badPassword1',
      newPassword: '',
    }
    try {
      const user = await User.updatePassword(1, badData)
      fail()
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy()
    }
  })
})

/************************************** updateUserPermissions */

describe('updateUserPermissions', function () {
  test('works: updates to admin', async function () {
    const data = {
      isAdmin: true
    }
    const user = await User.updateUserPermissions(1, data)
    
    expect(user).toEqual({
      id: 1,
      firstName: 'U1F',
      lastName: 'U1L',
      email: 'u1@email.com',
      needsNewPwd: true,
      isAdmin: true,
      isDeptHead: false,
    })
  })

  test('works: updates to deptartment head', async function () {
    const data = {
      isDeptHead: true,
    }
    const user = await User.updateUserPermissions(1, data)

    expect(user).toEqual({
      id: 1,
      firstName: 'U1F',
      lastName: 'U1L',
      email: 'u1@email.com',
      needsNewPwd: true,
      isAdmin: false,
      isDeptHead: true,
    })
  })

  test('fails: no such user', async function () {
    const data = {
      isDeptHead: true,
    }
    try {
      const user = await User.updateUserPermissions(0, data)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})

/************************************** availability */

describe('availability', function () {
  test('works: makes unavailable', async function () {
    const startDate = new Date(2022, 6, 14)
    const endDate = new Date(2022, 6, 15)
    const result = await User.makeUnavailable(1, [startDate, endDate])

    expect(result).toEqual(undefined)
  })

  test('works: makes available', async function () {
    // passed the id for unavailable table item
    const result = await User.makeAvailable(1)

    expect(result).toEqual({ id: 1 })
  })
})

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove(1);
    const res = await db.query(
        "SELECT * FROM users WHERE id = 1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

