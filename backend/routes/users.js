"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, } = require("../middleware/auth");
const { BadRequestError, NotFoundError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const unavailableSchema = require("../schemas/unavailable.json")

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin or department head.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { firstName, lastName, email, isAdmin, isDeptHead }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {firstName, lastName, email, needsNewPwd, isAdmin, isDeptHead }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id] => { user }
 *
 * Returns { firstName, lastName, needsNewPwd, isAdmin, isDeptHead, positions }
 *   where positions is [position.name]
 *
 * Authorization required: admin or same user-as-:id
 **/

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const user = await User.get(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { user } => { user }
 *
 * Data can include:
 *   From User: { firstName, lastName, email }
 *
 * Returns { id, firstName, lastName, email, isAdmin, isDeptHead }
 *
 * Authorization required: admin or same-user-as-:id
 **/

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.id, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 **/

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id]/password {user} => {user} 
 * 
 * Data can include { password, newPassword }
 * 
 * Returns { id, firstName, lastName, email, isAdmin, isDeptHead }
 * 
 * Authorization required: admin or same-user-as-:id
*/
router.patch("/:id/password", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema)
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack)
      throw new BadRequestError(errs)
    }

    const user = await User.updatePassword(req.params.id, req.body)
    return res.json({ user })
  } catch (err) {
    return next(err)
  }
})


/** PATCH /[id]/auth {user} => {user}
 * 
 * Data can include { isAdmin [boolean], isDeptHead [boolean] }
 */
router.patch("/:id/auth", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema)
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack)
      throw new BadRequestError(errs)
    }

    const user = await User.updateUserPermissions(req.params.id, req.body)
    return res.json({ user })
  } catch (err) {
    return next(err)
  }
})

/** POST /[id]/unavailable
 * 
 * Data must include { date [string] } it must be in YYYY-MM-DD format.
 * (To accomplish this, in javascript, use '.toISOString().split('T')[0]' after )
 */
router.post("/:id/unavailable", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, unavailableSchema)
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack)
      throw new BadRequestError(errs)
    }

    await User.makeUnavailable(req.params.id, req.body.dates)
    return res.status(201).json({ msg: "Successfully made unavailable."})
  } catch (err) {
    return next(err)
  }
})

/** DELETE /[id]/unavailable/[unvlId]
 * 
 * Throws errors if user or unavailable id not found
 */
router.delete('/:id/unavailable/:unvlId', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
      const user = await User.get(req.params.id)
      if (!user) throw new NotFoundError(`No user: ${req.params.id}`)

      await User.makeAvailable(req.params.unvlId)
      return res.status(201).json({ msg: 'Successfully made available.' })
    } catch (err) {
      return next(err)
    }
  }
)


module.exports = router;