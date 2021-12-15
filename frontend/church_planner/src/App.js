import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import AuthContext from './AuthContext'
import './css/App.css'
import useAuth from './useAuth'

function App() {
  const auth = useAuth()

  return (
    <div className="App">
      <AuthContext.Provider value={auth}>
        <NavBar />
        <main className="pt-5 mt-5 container">
          <Outlet />
        </main>
      </AuthContext.Provider>
    </div>
  )
}

export default App
