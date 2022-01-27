## To-Do
- [ ] Add tests for updateUserQuery in sql.js
- [ ] Create "forgot password" feature 
  - [ ] Should send an email to user's email verifying they started the reset
    - [ ] If not, allow correct user to change password (requiring old password be entered)
    - [ ] If so, should set "needs_new_pwd" in user table to true
      - [ ] Email link should direct to a change password page (not requiring old password)


## Completed
- [x] 'needs_new_pwd' set to true by default
- [x] Add tests for new user model methods