import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ButtonGroup } from 'reactstrap'
import AuthContext from './AuthContext'

const Home = () => {
  const { currUser, getUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('id'))

    if (!currUser) {
      if (id) {
        getUser(id)
      }
    } else {
      if (!id) {
        navigate('/login')
      }

      navigate(`/users/${id}`)
    }
  }, [currUser, getUser, navigate])

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
}

export default Home