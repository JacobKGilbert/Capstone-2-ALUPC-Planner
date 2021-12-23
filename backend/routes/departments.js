'use strict'

/** Routes for users. */

const jsonschema = require('jsonschema')

const express = require('express')
const { ensureAdmin, ensureDeptHeadOrAdmin } = require('../middleware/auth')
const { BadRequestError } = require('../expressError')
const Department = require('../models/department')
const departmentCreationSchema = require('../schemas/departmentCreation.json')
const departmentUpdateSchema = require('../schemas/departmentUpdate.json')

const router = express.Router()

/** POST / => { department } => { department }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin or department head.
 *
 *  {department: { code, name, deptHead } }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, departmentCreationSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const department = await Department.create(req.body);
    return res.status(201).json({ department });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { departments: [ { code, name, deptHead }, ... ] }
 *
 * Returns list of all departments.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const departments = await Department.getAll();
    return res.json({ departments });
  } catch (err) {
    return next(err);
  }
});


/** GET /[code] => { department }
 *
 * Returns { code, name, deptHead, events, positions, volunteers }
 *   where events is [{ id, date }...], 
 *         positions is [position.name], 
 *         volunteers is [{ id, firstName, lastName, email, positions, events,
 *                        unavailable }]
 *
 * Authorization required: admin or same deptHead
 **/

router.get("/:code", ensureDeptHeadOrAdmin, async function (req, res, next) {
  try {
    const department = await Department.get(req.params.code);
    return res.json({ department });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[code] { department } => { department }
 *
 * Data can include:
 *   From Department: { name, deptHead }
 *
 * Returns { code, name, deptHead }
 *
 * Authorization required: admin or same deptHead
 **/

router.patch("/:code", ensureDeptHeadOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, departmentUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const department = await Department.update(req.params.code, req.body);
    return res.json({ department });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[code]  =>  { deleted: code }
 *
 * Authorization required: admin
 **/

router.delete("/:code", ensureAdmin, async function (req, res, next) {
  try {
    await Department.delete(req.params.code);
    return res.json({ deleted: req.params.code });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;