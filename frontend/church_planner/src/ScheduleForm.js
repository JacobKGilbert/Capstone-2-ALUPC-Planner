import React, { useContext, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  Col,
  Input,
  Form,
  Row,
  Button,
  FormGroup,
  Label,
} from 'reactstrap'
import AuthContext from './AuthContext'
import 'react-calendar/dist/Calendar.css'
import ChurchPlannerApi from './api'

const ScheduleForm = () => {
  const { currUser } = useContext(AuthContext)
  const { deptCode } = useParams()
  const [ dept, setDept ] = useState()
  const [ value, onChange ] = useState(new Date())
  const navigate = useNavigate()

  const INITIAL_STATE = {}

  //Set INITIAL_STATE's beginning key/values
  if (dept) {
    for (const position of dept.positions) {
      INITIAL_STATE[position.code] = ''
    }
  }

  const [ formData, setFormData ] = useState(INITIAL_STATE)

  useEffect(() => {
    const getDepartment = async (code) => {
      const dept = await ChurchPlannerApi.getDept(code)
      setDept(dept)
    }

    if (!dept) {
      getDepartment(deptCode)
    }
  },[dept, deptCode])

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }))
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const data = { positions: { ...formData }, date: value }
    const event = await ChurchPlannerApi.createEvent(data, deptCode)
    navigate(`/events/${event.id}`)
  }

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
          <div className="col-md-4 position-absolute top-50 start-50 translate-middle">
            <h3>Schedule</h3>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Calendar
                    onChange={onChange}
                    value={value}
                    selectRange={false}
                    minDate={new Date()}
                    calendarType="US"
                  />
                </Col>
                <Col>
                  {dept.positions.map((p) => {
                    return (
                      <FormGroup floating key={`${p.code}`}>
                        <Label htmlFor={p.code}>{p.name}</Label>
                        <Input
                          type="select"
                          id={p.code}
                          name={p.code}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {dept.volunteers.map((v) => {
                            for (const position of v.positions) {
                              if (position === p.name) {
                                const alreadyScheduled = v.events.some(e => {
                                  if (e.date === value.toISOString()) {
                                    return true
                                  }
                                  return false
                                })
                                const unavailable = v.unavailable.some(u => {
                                  return u.dates.includes(value.toISOString())
                                })

                                if (alreadyScheduled || unavailable) {
                                  return null
                                } else {
                                  return (
                                    <option value={v.id}>
                                      {v.firstName} {v.lastName}
                                    </option>
                                  )
                                }
                              }
                            }
                            return null
                          })}
                        </Input>
                      </FormGroup>
                    )
                  })}
                  <Button color='primary'>Submit</Button>
                </Col>
              </Row>
            </Form>
          </div>
        )
      }
    }
  }
}

export default ScheduleForm