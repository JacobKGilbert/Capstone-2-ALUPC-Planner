import { Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './Home'
import LoginForm from './LoginForm'
import Users from './Users'
import Profile from './Profile'
import UpdateUser from './UpdateUser'
import Departments from './Departments'
import Department from './Department'
import ScheduleForm from './ScheduleForm'

const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="users">
          <Route index element={<Users />} />
          <Route path=":id">
            <Route index element={<Profile />} />
            <Route path="update" element={<UpdateUser />} />
          </Route>
        </Route>
        <Route path="departments">
          <Route index element={<Departments />} />
          <Route path=":deptCode">
            <Route index element={<Department />} />
            <Route path="schedule" element={<ScheduleForm />} />
          </Route>
        </Route>
        <Route path='events'>
          <Route index element={<h1>Events</h1>} />
          <Route path=':eventId'>
            <Route index element={<h1>Single Event</h1>} />

          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

// const AuthUser = ({ children, redirectTo, user }) => {
//   return user ? children : <Navigate to={redirectTo} />
// }

export default RoutesList