## To-Do
- [ ] Add tests for updateUserQuery in sql.js
- [ ] Create "forgot password" feature 
  - [ ] Should send an email to user's email verifying they started the reset
    - [ ] If not, allow correct user to change password (requiring old password be entered)
    - [ ] If so, should set "needs_new_pwd" in user table to true
      - [ ] Email link should direct to a change password page (not requiring old password)
- [ ] Potential bug! When opening site page, after leaving site without logging out, useAuth.getUser sends four api requests when only one should be sent. Does not seem to break anything, but could slow down backend with too many people logging on at the same time.
- [ ] Bug! As Admin, when looking at another user's profile, you can't navigate back to your own profile page by clicking 'Profile' in the navbar.

## Completed
- [x] 'needs_new_pwd' set to true by default
- [x] Add tests for new user model methods