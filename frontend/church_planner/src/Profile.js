import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import ChurchPlannerApi from './api'
import UnavailableForm from './UnavailableForm'
import AuthContext from './AuthContext'
import EventCard from './EventCard'
import MyTooltip from './Tooltip'

const Profile = () => {
  const { currUser } = useContext(AuthContext)
  const [ user, setUser ] = useState()
  const { id } = useParams()

  useEffect(() => {
    const getUser = async (id) => {
      const user = await ChurchPlannerApi.getUser(id)
      setUser(user)
    }

    if (!user) {
      getUser(id)
    }
  }, [user, id])

  if (!user) {
    return <h1>Loading...</h1>
  } else {
    if (!(currUser.id === id || currUser.isAdmin)) {
      return <Navigate to={`users/${currUser.id}`} />
    } else {
      return (
        <div className="row">
          <h1>
            {user.firstName} {user.lastName}'s Profile
          </h1>
          <div className="col-xl-9 col-lg-8 col-md-7 col-sm-6 mt-2">
            <h2>My Schedule</h2>
            {user.events.map((ev) => (
              <EventCard key={ev.id} event={ev} type="user"/>
            ))}
          </div>
          <div className="col-xl-3 col-lg-4 col-md-5 col-sm-6 mt-4">
            <h5>
              Going to be out of town?{' '}
              <span>
                <MyTooltip />
              </span>
            </h5>
            <UnavailableForm />
          </div>
        </div>
      )
    }
  }
}

export default Profile