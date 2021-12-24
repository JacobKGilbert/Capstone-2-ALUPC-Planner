import React, { useContext } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardText } from 'reactstrap'
import UnavailableForm from './UnavailableForm'
import AuthContext from './AuthContext'
import EventCard from './EventCard'
import MyTooltip from './Tooltip'

const Profile = () => {
  const { currUser } = useContext(AuthContext)
  const { id } = useParams()

  if (currUser) {
    if (currUser.id === id || currUser.isAdmin) {
      return (
        <div className="row">
          <h1>
            {currUser.firstName} {currUser.lastName}'s Profile
          </h1>
          <div className="col-xl-9 col-lg-8 col-md-7 col-sm-6 mt-2">
            <h2>My Schedule</h2>
            {currUser.events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
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
    } else {
      <Navigate to={`users/${currUser.id}`} />
    }
  } else {
    return <h1>Loading...</h1>
  }
}

export default Profile