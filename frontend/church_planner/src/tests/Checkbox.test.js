import React from 'react'
import { render } from '@testing-library/react'
import Checkbox from '../Checkbox'

it('should render', () => {
  render(<Checkbox />)
})

it('should match snapshot', () => {
  const { asFragment } = render(<Checkbox />)
  expect(asFragment()).toMatchSnapshot()
})
