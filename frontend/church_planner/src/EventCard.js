import React from 'react'
// import { useNavigate } from 'react-router-dom'
import { Card, CardTitle, CardText } from 'reactstrap'

const EventCard = ({ event }) => {
  const date = event.date.split('T')[0]

  return (
    <Card body>
      <CardTitle tag="h5">{date}</CardTitle>
      <CardText>{event.deptName} - {event.positionName}</CardText>
    </Card>
  )
}

export default EventCard