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
    const user = await ChurchPlannerApi.loginUser({ email, password })
    
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