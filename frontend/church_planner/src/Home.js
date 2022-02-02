import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button, ButtonGroup } from 'reactstrap'
import AuthContext from './AuthContext'

const Home = () => {
  const { currUser, locId } = useContext(AuthContext)

  if (!currUser) {
    return (
      <div className="Home d-flex flex-column justify-content-center align-items-center">
        <h1>Church Planner</h1>
        <p>Get the right volunteers, in the right places.</p>
        <ButtonGroup>
          <Link to="/login">
            <Button outline color="primary" size="md">
              Log In
            </Button>
          </Link>
        </ButtonGroup>
      </div>
    )
  } else {
    return <Navigate to={`/users/${locId}`} />
  } 
}

export default Home