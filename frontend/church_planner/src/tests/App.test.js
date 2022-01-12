import { render } from '@testing-library/react';
import App from '../App';
import useRouter from './renderWithRouter';

it('should render', () => {
  render(useRouter(<App />))
});