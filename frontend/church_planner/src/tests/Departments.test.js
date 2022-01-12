import { render, cleanup, act } from '@testing-library/react'
import Departments from '../Departments'
import useRouter from './renderWithRouter'
import useProvider from './renderWithProvider'
import ChurchPlannerApi from '../api'

afterEach(cleanup)

jest.mock('../api')

const authNullUser = {
  currUser: null,
}

const authUserNonAdmin = {
  currUser: { id: 1, isAdmin: false },
}

const authUserIsAdmin = {
  currUser: { id: 1, isAdmin: true },
}

const testAllDepts = [
  {
    code: 'td',
    name: 'Test Department',
    events: [],
    volunteers: [],
  },
]

it('should render and redirect with no user', () => {
  const { container } = render(
    useRouter(useProvider(<Departments />, authNullUser), '/login')
  )

  //It has redirected to /login
  expect(container).toHaveTextContent('/login')
})

it('should render with user nonAdmin', () => {
  const { container } = render(
    useRouter(useProvider(<Departments />, authUserNonAdmin), '/users/1')
  )

  //It has redirected to /users/1
  expect(container).toHaveTextContent('/users/1')
})

it('should render with user as admin and no dept', async () => {
  const promise = Promise.resolve()
  ChurchPlannerApi.getAllDepts = jest.fn(() => promise)

  const { container } = render(
    useRouter(useProvider(<Departments />, authUserIsAdmin), '/login')
  )
  await act(() => promise)

  //It shows loading screen
  expect(container).toHaveTextContent('Loading...')
})

it('should render with user as admin and dept', async () => {
  const promise = Promise.resolve(testAllDepts)
  ChurchPlannerApi.getAllDepts = jest.fn(() => promise)

  const { container } = render(
    useRouter(useProvider(<Departments />, authUserIsAdmin), '/login')
  )
  await act(() => promise)

  //It shows department list
  expect(container).toHaveTextContent('Test Department')
})