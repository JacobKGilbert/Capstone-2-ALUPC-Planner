import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'reactstrap'
import UserContext from './AuthContext'
import Calendar from 'react-calendar'
import ChurchPlannerApi from './api'
import 'react-calendar/dist/Calendar.css'

const UnavailableForm = () => {
  const { currUser } = useContext(UserContext)
  const [value, onChange] = useState([new Date(), new Date()])
  const navigate = useNavigate()

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    await ChurchPlannerApi.makeUnavailable({ id: currUser.id, dates: value })
    onChange([new Date(), new Date()])
    navigate(`/users/${currUser.id}`)
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Calendar
          onChange={onChange}
          value={value}
          selectRange={true}
          minDate={new Date()}
          calendarType='US'
        />
        <div className="d-grid gap-2">
          <Button color="primary" className="mb-2 btn-sm ">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default UnavailableForm