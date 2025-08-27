import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders the company name and contact info', () => {
    render(<Footer />);
    expect(screen.getByText(/Green Reuse Exchange/i)).toBeInTheDocument();
    expect(screen.getByText(/clintonmg17@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Kisii County, Kenya/i)).toBeInTheDocument();
  });
});
