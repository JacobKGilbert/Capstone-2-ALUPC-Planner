import { Card, CardTitle } from 'reactstrap'

const VolunteerCard = ({ volunteer }) => {
  return (
    <Card body>
      <CardTitle>
        {volunteer.lastName}, {volunteer.firstName}
      </CardTitle>
    </Card>
  )
}

export default VolunteerCard