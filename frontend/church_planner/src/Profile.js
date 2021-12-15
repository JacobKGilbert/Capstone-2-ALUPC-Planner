import React, { useContext, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap'
import UnavailableForm from './UnavailableForm'
import AuthContext from './AuthContext'
import EventCard from './EventCard'
import MyTooltip from './Tooltip'

const Profile = () => {
  const { currUser, getUser } = useContext(AuthContext)
  const id = JSON.parse(localStorage.getItem('id'))

  useEffect(() => {
    const gU = async (id) => await getUser(id)

    if (!currUser) {
      if (id) {
        gU(id)
      }
    }
  }, [currUser, getUser, id])

  if (currUser) {
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
          <Card>
            <CardHeader tag="h3">Links</CardHeader>
            <CardBody>
              <CardTitle tag="h5">Special Title Treatment</CardTitle>
              <CardText>
                <Link to="update">
                  Update Profile
                </Link>
              </CardText>
            </CardBody>
          </Card>
          <Outlet />
        </div>
      </div>
    )
  } else {
    return <h1>Loading...</h1>
  }
}

export default Profile