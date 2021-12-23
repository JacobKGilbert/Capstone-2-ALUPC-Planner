import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import { Collapse, 
         Navbar, 
         NavbarToggler, 
         NavbarBrand, 
         Nav, 
         NavItem, 
         Button,
         UncontrolledDropdown,
         DropdownToggle,
         DropdownMenu,
         DropdownItem
       } from "reactstrap";
import AuthContext from './AuthContext'

const NavBar = () => {
  const { currUser, logout } = useContext(AuthContext)
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()
  let userOptions

  const deptHeadOptions = (
    <DropdownItem>
      <NavLink className="nav-link text-dark" to={`:deptId/schedule`}>
        Schedule
      </NavLink>
    </DropdownItem>
  )

  const adminOptions = (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        Options
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem>
          <NavLink className="nav-link text-dark" to={`/users`}>
            Users
          </NavLink>
        </DropdownItem>
        <DropdownItem>
          <NavLink className="nav-link text-dark" to={`/departments`}>
            Departments
          </NavLink>
        </DropdownItem>
        {currUser.isDeptHead ? deptHeadOptions : <div></div>}
      </DropdownMenu>
    </UncontrolledDropdown>
  )

  const toggleNavbar = () => setCollapsed(!collapsed)

  const handleClick = () => {
    logout()
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
        {currUser.isAdmin ? adminOptions : null}
        <NavItem>
          <NavLink className="nav-link" to={`/users/${currUser.id}`}>
            Profile
          </NavLink>
        </NavItem>
        <NavItem>
          <Button color='danger' onClick={handleClick}>
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