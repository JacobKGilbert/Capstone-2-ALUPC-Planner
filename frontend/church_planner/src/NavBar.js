import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button } from "reactstrap";
import AuthContext from './AuthContext'

const NavBar = () => {
  const { currUser, setCurrUser } = useContext(AuthContext)
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()
  let userOptions

  const toggleNavbar = () => setCollapsed(!collapsed)

  const logout = () => {
    setCurrUser(null)

    localStorage.removeItem('token')
    localStorage.removeItem('id')

    navigate('/')
  }

  if (!currUser) {
    userOptions = (
      <Nav navbar className="ms-auto">
        <NavItem>
          <NavLink className="nav-link" to="/login">
            Log In
          </NavLink>
        </NavItem>
      </Nav>
    )
  } else {
    userOptions = (
      <Nav navbar className="ms-auto">
        <NavItem>
          <NavLink className="nav-link" to={`/users/${currUser.id}`}>
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <Button color='danger' onClick={logout}>
            Log Out
          </Button>
        </NavItem>
      </Nav>
    )
  }

  return (
    <Navbar fixed="top" expand="md" color="dark" dark>
      <NavbarBrand href="/" className="mr-auto">
        Church Planner
      </NavbarBrand>

      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
        {userOptions}
      </Collapse>
    </Navbar>
  )
}

export default NavBar