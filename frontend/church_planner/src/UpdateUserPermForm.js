import { useState } from 'react'
import { Form, Col, FormGroup, Label, Button, Row } from 'reactstrap'
import ChurchPlannerApi from './api'
import Checkbox from './Checkbox'

const UpdateUserPermForm = ({ user }) => {
  const INITIAL_STATE = {
    id: user.id,
    needsNewPwd: user.needsNewPwd,
    isAdmin: user.isAdmin,
    isDeptHead: user.isDeptHead
  }
  const [formData, setFormData] = useState(INITIAL_STATE)

  const updateFormData = (evt) => {
    const { name, value } = evt.target
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }))
  }

  const updateUser = async (data) => {
    try {
      await ChurchPlannerApi.updateUserPermissions(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    
    await updateUser({ ...formData })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col sm={3}>
          <FormGroup check inline>
            <Label check>
              <Checkbox
                defCheck={formData.needsNewPwd}
                idAndName="needsNewPwd"
                updateFormData={updateFormData}
              />
              Needs New Password
            </Label>
          </FormGroup>
        </Col>
        <Col sm={2}>
          <FormGroup check inline>
            <Label check>
              <Checkbox
                defCheck={formData.isAdmin}
                idAndName="isAdmin"
                updateFormData={updateFormData}
              />
              Admin
            </Label>
          </FormGroup>
        </Col>
        <Col sm={4}>
          <FormGroup check inline>
            <Label check>
              <Checkbox
                defCheck={formData.isDeptHead}
                idAndName="isDeptHead"
                updateFormData={updateFormData}
              />
              Department Head
            </Label>
          </FormGroup>
        </Col>
        <Col sm={3}>
          <Button color="primary" className="pb-2">
            Update
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UpdateUserPermForm