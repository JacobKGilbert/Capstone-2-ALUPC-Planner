import { Link } from 'react-router-dom'
import { 
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from 'reactstrap'
import UpdateUserPermForm from './UpdateUserPermForm'
import ChurchPlannerApi from './api'
import { useState } from 'react'

const UserCard = ({ user }) => {
  const [ modal, setModal ] = useState(false)
  const toggle = () => setModal(!modal)
  const handleClick = async () => {
    await ChurchPlannerApi.deleteUser(user.id)
  }

  return (
    <Col sm={6}>
      <Card>
        <CardHeader tag="h3">
          <Link to={`${user.id}`} className="text-decoration-none text-dark">
            {user.lastName}, {user.firstName}
          </Link>
        </CardHeader>
        <CardBody tag="h6">
          <Row>
            <UpdateUserPermForm user={user} />
          </Row>
        </CardBody>
        <CardFooter>
          <Button color="danger" className="pb-2" onClick={toggle}>
            Delete User
          </Button>
        </CardFooter>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
          <ModalBody>
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleClick}>
              Delete User
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        
      </Card>
    </Col>
  )
}

export default UserCard