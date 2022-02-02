# Church Planner

Church Planner was created to help reduce the confusion of scheduling volunteers in multiple departments for the same event. (i.e. Volunteer being scheduled for the praise team and the sound booth. _Only possible with an iPad. Trust me, I know._ ) To help stop such tom-foolery, Church Planner was designed to allow a volunteer to be scheduled for one position during one event, by removing the volunteer from the selection list if already scheduled. The user can also easily schedule days off, this too will keep the volunteer from being selected for any of those days.

## For a demo visit: [Church Planner](https://church-planner-jkg-capstone-2.vercel.app/)

## To run a local copy:

1. Clone and download this repo.
2. Navigate to the backend directory
   1. Run `npm install`
   2. Run `npm start` or `nodemon start`
3. Create a Postgresql database for live and test
   1. While in the backend directory, Run `psql < create.sql` and follow the prompts to create and seed the live and test databases.
4. Navigate to the church_planner directory within frontend
   1. Run `npm install`
   2. Run `npm start`
5.  Navigate to https://localhost:3000

## To run tests simply run `npm test` in both backend and church_planner directories.

## Test users login info:
Admin
- admin@test.com
- password

Department Head
- depthead@test.com
- password

User
- user@test.com
- password

## This project was produced with the following:
### Backend
- Node.js
- Express.js
- Postgresql
- Node PG

### Frontend
- React
- React-Router V6
- Reactstrap

Special thanks to Wojciech Maj for the [React Calendar](https://projects.wojtekmaj.pl/react-calendar/) used in this project.