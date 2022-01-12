import AuthContext from '../AuthContext'

const useProvider = (component, auth) => {
  return (
    <AuthContext.Provider value={auth}>
      {component}
    </AuthContext.Provider>
  )
}

export default useProvider