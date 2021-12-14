import React, { useContext, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ButtonGroup } from 'reactstrap'
import ChurchPlannerApi from './api'
import UserContext from './UserContext'

const Home = () => {
  const { currUser, setCurrUser } = useContext(UserContext)

  const navigate = useNavigate()

  const getUser = useCallback(async (id) => {
      const user = await ChurchPlannerApi.getUser(id)
      setCurrUser(user)
    }, [setCurrUser])

  useEffect(() => {
    const localToken = JSON.parse(localStorage.getItem('token'))
    const id = JSON.parse(localStorage.getItem('id'))
    if (!currUser) {
      if (localToken && id) {
        getUser(id)
      }
    } else {
      if (localToken && id) {
        navigate(`/users/${id}`)
      }
    }
  }, [currUser, getUser, navigate])

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
    return (
      <div className="Home d-flex flex-column justify-content-center align-items-center">
        <h1>Church Planner</h1>
        <p>Get the right volunteers, in the right places.</p>
        <h3>
          Welcome, {currUser.firstName} {currUser.lastName}!
        </h3>
      </div>
    )
  }
}

export default Home