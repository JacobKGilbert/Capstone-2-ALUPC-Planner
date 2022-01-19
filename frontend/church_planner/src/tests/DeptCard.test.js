import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeptCard from '../DeptCard'
import useRouter from './renderWithRouter'

const testDept = {
  code: 'test',
  deptHead: {firstName: 'Test', lastName: 'Head'}
}

it('should render', () => {
  const { container } = render(useRouter(<DeptCard dept={testDept} />))

  expect(container).toHaveTextContent('Department Head: Test Head')
})

it('should match snapshot', () => {
  const { asFragment } = render(useRouter(<DeptCard dept={testDept} />))
  expect(asFragment()).toMatchSnapshot()
})

it('should display modal when delete button is clicked', () => {
  render(useRouter(<DeptCard dept={testDept} />))
  
  const modalToggleButton = screen.getByRole('button', {
    name: 'Delete Department',
  })

  userEvent.click(modalToggleButton)

  expect(screen.getByText('Are You Sure?')).toHaveTextContent('Are You Sure?')
})