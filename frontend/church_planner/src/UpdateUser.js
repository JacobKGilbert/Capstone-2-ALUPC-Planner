import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Label, Input, Button, Alert } from 'reactstrap'
import AuthContext from './AuthContext'
import ChurchPlannerApi from './api'

const UpdateUser = () => {
  const { currUser, setCurrUser } = useContext(AuthContext)

  const INITIAL_STATE = {
    firstName: `${currUser.firstName}`,
    lastName: `${currUser.lastName}`,
    email: `${currUser.email}`,
    password: '',
  }
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [updated, setUpdated] = useState(false)
  const navigate = useNavigate()

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }))
  }

  const updateUser = async (data) => {
    try {
      const user = await ChurchPlannerApi.updateUser(data)
      if (user) {
        setUpdated(true)
        setCurrUser(user)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    INITIAL_STATE.password = ''
    await updateUser({ ...formData })
    navigate(`/users/${currUser.id}`)
  }

  return (
    <div className="col-md-4 position-absolute top-50 start-50 translate-middle">
      <h3>Update Your Profile</h3>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <Label htmlFor="lastName">Last Name</Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="row mt-2">
          <div className="col-md-4">
            <Button color="primary" className="pb-2">
              Save Changes
            </Button>
          </div>
          <div className="col-md-8">
            {updated ? (
              <Alert color="success" className="mb-0 p-2">
                Updated Successfully
              </Alert>
            ) : null}
          </div>
        </div>
      </Form>
    </div>
  )
}

export default UpdateUser
