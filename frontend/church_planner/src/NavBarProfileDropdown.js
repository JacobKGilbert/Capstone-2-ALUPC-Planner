import { useContext } from 'react'
import AuthContext from './AuthContext'
import { NavLink } from 'react-router-dom'
import { 
  UncontrolledDropdown,
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem 
} from 'reactstrap'

const NavBarProfileDropdown = () => {
  const { currUser } = useContext(AuthContext)

  return (
    <>
      <NavLink className="nav-link" to={`/users/${currUser.id}`}>
        Profile
      </NavLink>
      
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret></DropdownToggle>
        <DropdownMenu end>
          <DropdownItem>
            <NavLink
              to={`/users/${currUser.id}/update`}
              className="nav-link text-dark"
            >
              Update Profile
            </NavLink>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default NavBarProfileDropdown