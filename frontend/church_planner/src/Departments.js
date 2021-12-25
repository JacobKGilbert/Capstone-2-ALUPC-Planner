import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container, Row } from 'reactstrap'
import ChurchPlannerApi from './api'
import AuthContext from './AuthContext'
import DeptCard from './DeptCard'

const DepartmentsList = () => {
  const { currUser } = useContext(AuthContext)
  const [allDepts, setAllDepts] = useState(null)

  useEffect(() => {
    const getAllDepts = async () => {
      const depts = await ChurchPlannerApi.getAllDepts()
      setAllDepts(depts)
    }

    if (!allDepts) {
      getAllDepts()
    }
  }, [allDepts])

  if (!currUser) {
    return <Navigate to={'/login'} />
  } else if (!currUser.isAdmin) {
    return <Navigate to={`users/${currUser.id}`} />
  } else {
    if (!allDepts) return <h1>Loading...</h1>

    if (allDepts) {
      return (
        <Container className="themed-container" fluid={true}>
          <h1>Departments</h1>
          <Row>
            {allDepts.map((d) => (
              <DeptCard key={d.code} dept={d} />
            ))}
          </Row>
        </Container>
      )
    }
  }
}

export default DepartmentsList
