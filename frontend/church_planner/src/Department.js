import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import ChurchPlannerApi from './api'
import AuthContext from './AuthContext'
import EventCard from './EventCard'
import VolunteerCard from './VolunteerCard'

const Department = () => {
  const { currUser } = useContext(AuthContext)
  const [ dept, setDept ] = useState()
  const { deptCode } = useParams()

  useEffect(() => {
    const getDept = async (code) => {
      const dept = await ChurchPlannerApi.getDept(code)
      setDept(dept)
    }

    if(!dept) {
      getDept(deptCode)
    }
  }, [dept, deptCode])

  if (!currUser) {
    return <Navigate to={`/login`} />
  } else {
    if (!(currUser.isAdmin || currUser.isDeptHead)) {
      return <h1>You do not have permission to view this.</h1>
    } else {
      if (!dept) {
        return <h1>Loading...</h1>
      } else {
        return (
          <Row>
            <h1>{dept.name}</h1>
            <Col>
              <h4>Events</h4>
              <Link to={`schedule`}>Schedule New Event</Link>
              {dept.events.map((e) => {
                return <EventCard key={e.id} event={e} type="department" />
              })}
            </Col>
            <Col>
              <h4>Volunteers</h4>
              <Link to={`volunteer`}>Add New Volunteer</Link>
              {dept.volunteers.map((v) => {
                return <VolunteerCard key={v.id} volunteer={v} />
              })}
            </Col>
          </Row>
        )
      }
    }
  }
}

export default Department