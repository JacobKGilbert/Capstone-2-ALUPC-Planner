"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
  ensureDeptHeadOrAdmin
} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ firstName: "test", lastName: "name", isAdmin: false, isDeptHead: false }, SECRET_KEY);
const badJwt = jwt.sign({ firstName: "test", lastName: "name", isAdmin: false, isDeptHead: false }, "wrong");


describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
    
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        firstName: 'test',
        lastName: 'name',
        isAdmin: false,
        isDeptHead: false,
      },
    })
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = {
      locals: {
        user: {
          firstName: 'test',
          lastName: 'name',
          isAdmin: false,
          isDeptHead: false,
        },
      },
    }
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});


describe("ensureAdmin", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = {
      locals: {
        user: {
          firstName: 'test',
          lastName: 'name',
          isAdmin: true,
          isDeptHead: false,
        },
      },
    }
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if not admin", function () {
    expect.assertions(1);
    const req = {};
    const res = {
      locals: {
        user: {
          firstName: 'test',
          lastName: 'name',
          isAdmin: false,
          isDeptHead: false,
        },
      },
    }
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if anon", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});


describe("ensureCorrectUserOrAdmin", function () {
  test("works: admin", function () {
    expect.assertions(1);
    const req = { params: { firstName: "test", lastName: "name" } };
    const res = { locals: { user: { firstName: "admin", lastName: "user", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works: same user", function () {
    expect.assertions(1);
    const req = { params: { firstName: 'test', lastName: 'name' } }
    const res = {
      locals: { user: { firstName: 'test', lastName: 'name', isAdmin: false } },
    }
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: mismatch: wrong firstName", function () {
    expect.assertions(1);
    const req = { params: { firstName: 'wrong', lastName: 'name' } }
    const res = {
      locals: { user: { firstName: 'test', lastName: 'name', isAdmin: false } },
    }
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: mismatch: wrong lastName", function () {
    expect.assertions(1);
    const req = { params: { firstName: 'test', lastName: 'wrong' } }
    const res = {
      locals: { user: { firstName: 'test', lastName: 'name', isAdmin: false } },
    }
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: if anon", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });
});
