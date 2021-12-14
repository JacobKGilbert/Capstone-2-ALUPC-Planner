import { Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './Home'
import LoginForm from './LoginForm'
import Profile from './Profile'
import UpdateUser from './UpdateUser'

const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="users">
          <Route path=":id">
            <Route index element={<Profile />} />
            <Route path="update" element={<UpdateUser />} />
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