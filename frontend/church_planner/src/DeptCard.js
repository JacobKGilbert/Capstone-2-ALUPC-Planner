import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import ChurchPlannerApi from './api'
import { useState } from 'react'

const DeptCard = ({ dept }) => {
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  const handleClick = async () => {
    await ChurchPlannerApi.deleteDept(dept.code)
  }

  return (
    <Col sm={6}>
      <Card>
        <CardHeader tag="h3">
          <Link to={`${dept.code}`} className="text-decoration-none text-dark">
            {dept.name}
          </Link>
        </CardHeader>
        <CardBody tag="h6">
          Department Head: {dept.deptHead ? 
              <Link 
                to={`/users/${dept.deptHead.id}`}
              >
                {dept.deptHead.firstName} {dept.deptHead.lastName}
              </Link> : 
              'Not Set'
            }
        </CardBody>
        <CardFooter>
          <Button color="danger" className="pb-2" onClick={toggle}>
            Delete Department
          </Button>
        </CardFooter>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Are You Sure?</ModalHeader>
          <ModalBody>This action cannot be undone.</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleClick}>
              Delete Department
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

export default DeptCard
