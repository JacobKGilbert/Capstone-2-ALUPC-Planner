import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChurchPlannerApi from './api'


const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currUser, setCurrUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeptHead, setIsDeptHead] = useState(false)

  const login = async ({ email, password }) => {
    setIsLoading(true)
    const { tkn, id } = await ChurchPlannerApi.loginUser({ email, password })
    localStorage.setItem('token', JSON.stringify(tkn))
    localStorage.setItem('id', JSON.stringify(id))

    const user = await ChurchPlannerApi.getUser(id)
    setCurrUser(user)
    setIsLoading(false)
  }

  const logout = () => {

  }

  return {
    isLoading,
    currUser,
    isAdmin,
    isDeptHead,
    login,
    logout
  }
}

export default useAuth