import { useState } from 'react'
import ChurchPlannerApi from './api'


const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currUser, setCurrUser] = useState(null)

  const login = async ({ email, password }) => {
    setIsLoading(true)
    const { id } = await ChurchPlannerApi.loginUser({ email, password })
    localStorage.setItem('id', JSON.stringify(id))

    await getUser(id)
    setIsLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('id')
    ChurchPlannerApi.token = null
    setCurrUser(null)
  }

  const getUser = async (id) => {
    const user = await ChurchPlannerApi.getUser(id)
    setCurrUser(user)
  }

  return {
    isLoading,
    currUser,
    login,
    logout,
    getUser
  }
}

export default useAuth