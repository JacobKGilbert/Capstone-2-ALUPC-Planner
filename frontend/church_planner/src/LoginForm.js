import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Label } from 'reactstrap';
import AuthContext from './AuthContext';

const LoginForm = () => {
  const INITIAL_STATE = {
    email: '',
    password: ''
  }
  const [formData, setFormData] = useState(INITIAL_STATE)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }))
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    await login({...formData})

    setFormData(INITIAL_STATE)

    const id = JSON.parse(localStorage.getItem('id'))
    navigate(`/users/${id}`)
  }

  return (
    <div className="col-md-4 position-absolute top-50 start-50 translate-middle">
      <h3>Login</h3>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
        />
        <Button color="primary" className="mt-2">
          Log In
        </Button>
        <p className="mb-0 mt-3">Not already a user?</p>
        <p className="mb-0 mt-3">Please speak with your administrator.</p>
      </Form>
    </div>
  )
}

export default LoginForm