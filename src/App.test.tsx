import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    const heading = screen.getByText(/Web App Starter Pack/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the edit instruction', () => {
    render(<App />);
    const instruction = screen.getByText(/src\/App.tsx/);
    expect(instruction).toBeInTheDocument();
  });

  it('renders learn links', () => {
    render(<App />);
    const reactLink = screen.getByRole('link', { name: /learn react/i });
    const tailwindLink = screen.getByRole('link', { name: /learn tailwind/i });
    
    expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    expect(tailwindLink).toHaveAttribute('href', 'https://tailwindcss.com');
  });
});