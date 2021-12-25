import React from 'react'
// import { useNavigate } from 'react-router-dom'
import { Card, CardTitle, CardText } from 'reactstrap'

const EventCard = ({ event, type }) => {
  const date = event.date.split('T')[0]

  if (type === 'user') {
    return (
      <Card body>
        <CardTitle tag="h5">{date}</CardTitle>
        <CardText>
          {event.deptName} - {event.positionName}
        </CardText>
      </Card>
    )
  }
  if (type === 'department') {
    return (
      <Card body>
        <CardTitle tag="h5">{date}</CardTitle>
      </Card>
    )
  }
}

export default EventCard