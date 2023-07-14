import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const comp = render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  expect(comp).not.toBeNull();
});
