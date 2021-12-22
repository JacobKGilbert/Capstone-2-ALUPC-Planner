import { useState } from 'react'
import ChurchPlannerApi from './api'


const useAuth = () => {
  const [currUser, setCurrUser] = useState(null)
  const locId = JSON.parse(localStorage.getItem('id'))

  const login = async ({ email, password }) => {
    const { tkn, id } = await ChurchPlannerApi.loginUser({ email, password })
    localStorage.setItem('token', JSON.stringify(tkn))
    localStorage.setItem('id', JSON.stringify(id))

    await getUser(id)
  }

  const logout = () => {
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    setCurrUser(null)
  }

  const getUser = async (id) => {
    const user = await ChurchPlannerApi.getUser(id)
    setCurrUser(user)
  }

  if (!currUser) {
    if (locId) {
      getUser(locId)
    }
  }

  return {
    currUser,
    login,
    logout,
    getUser
  }
}

export default useAuth