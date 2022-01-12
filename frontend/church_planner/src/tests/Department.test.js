import { render, cleanup, act } from '@testing-library/react'
import Department from '../Department'
import useRouter from './renderWithRouter'
import useProvider from './renderWithProvider'
import ChurchPlannerApi from '../api'

afterEach(cleanup)

jest.mock('../api')

const authNullUser = {
  currUser: null,
}

const authUserNonAdminOrDeptHead = {
  currUser: {isAdmin: false, isDeptHead: false},
}

const authUserIsAdmin = {
  currUser: { isAdmin: true, isDeptHead: false },
}

const authUserIsDeptHead = {
  currUser: { isAdmin: false, isDeptHead: true },
}

const testDept = {
  name: 'Test Department',
  events: [],
  volunteers: []
}

it('should render and redirect with no user', () => {
  const { container } = render(
    useRouter(useProvider(<Department />, authNullUser), '/login')
  )

  //It has redirected to /login
  expect(container).toHaveTextContent('/login')
})

it('should render with user nonAdminOrDeptHead', () => {
  const { container } = render(
    useRouter(useProvider(<Department />, authUserNonAdminOrDeptHead), '/login')
  )

  //It shows error message.
  expect(container).toHaveTextContent(
    'You do not have permission to view this.'
  )
})

it('should render with user as admin and no dept', () => {
  const promise = Promise.resolve()
  ChurchPlannerApi.getDept = jest.fn(() => promise)

  const { container } = render(
    useRouter(useProvider(<Department />, authUserIsAdmin), '/login')
  )

  //It shows loading screen
  expect(container).toHaveTextContent('Loading...')
})

it('should render with user as admin and dept', async () => {
  const promise = Promise.resolve(testDept)
  ChurchPlannerApi.getDept = jest.fn(() => promise)

  const { container } = render(
    useRouter(useProvider(<Department />, authUserIsAdmin), '/login')
  )
  await act(() => promise)

  expect(container).toHaveTextContent(testDept.name)
})

it('should render with user as deptHead and dept', async () => {
  const promise = Promise.resolve(testDept)
  ChurchPlannerApi.getDept = jest.fn(() => promise)

  const { container } = render(
    useRouter(useProvider(<Department />, authUserIsDeptHead), '/login')
  )
  await act(() => promise)

  expect(container).toHaveTextContent(testDept.name)
})