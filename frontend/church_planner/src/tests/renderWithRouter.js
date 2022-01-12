import { MemoryRouter, Route, Routes } from 'react-router-dom'

const useRouter = (component, redirectUrl) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={component} />
        <Route path={redirectUrl} element={<h1>{redirectUrl}</h1>} />
      </Routes>
    </MemoryRouter>
  )
}
// Thanks to Ilya Zykin for this answer
// See: https://the-teacher.medium.com/how-to-test-redirect-from-react-router-with-rtl-react-test-library-and-jest-242eced1c6b8

export default useRouter