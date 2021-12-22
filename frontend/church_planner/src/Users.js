import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Row } from 'reactstrap'
import ChurchPlannerApi from './api'
import AuthContext from './AuthContext'
import UserCard from './UserCard'

const UsersList = () => {
  const { currUser } = useContext(AuthContext)
  const [ allUsers, setAllUsers ] = useState(null)

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await ChurchPlannerApi.getAllUsers()
      setAllUsers(users)
    }

    if (!allUsers) {
      getAllUsers()
    }
  }, [allUsers])

  if (!currUser) {
    return <Navigate to={'/login'} />
  } else if (!currUser.isAdmin) {
    return <Navigate to={`users/${currUser.id}`} />
  } else {
    if (!allUsers) return <h1>Loading...</h1> 
    
    if (allUsers) {
      return (
        <Container className="themed-container" fluid={true}>
          <h1>Users</h1>
          <Row>
            {allUsers.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </Row>
        </Container>
      )
    }
  }
}

export default UsersList