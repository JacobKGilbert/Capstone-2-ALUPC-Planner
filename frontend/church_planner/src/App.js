import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import UserContext from './UserContext'
import './css/App.css'

function App() {
  const [currUser, setCurrUser] = useState(null)

  return (
    <div className="App">
      <UserContext.Provider value={{ currUser, setCurrUser }}>
        <NavBar />
        <main className="pt-5 mt-5 container">
          <Outlet />
        </main>
      </UserContext.Provider>
    </div>
  )
}

export default App
