import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

jest.mock('@supabase/auth-helpers-react', () => ({
  useUser: jest.fn(),
  useSupabaseClient: jest.fn(),
}));

const mockGetImages = jest.fn();

jest.mock('../components/UserDashboard', () => (props) => {
  mockGetImages.mockImplementation(props.getImages);
  return (
    <div>
      <p>User Dashboard</p>
      <p>{props.user.email}</p>
    </div>
  );
});

jest.mock('../components/LoginForm', () => (props) => (
  <div>
    <p>Login Form</p>
    <button onClick={props.supabase.auth.signInWithOtp}>Login</button>
  </div>
));

jest.mock('../components/Header', () => () => <div>Header</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form when user is not logged in', () => {
    useUser.mockReturnValue(null);
    useSupabaseClient.mockReturnValue({
      auth: {
        signInWithOtp: jest.fn(),
      },
    });

    render(<App />);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('renders user dashboard when user is logged in', async () => {
    useUser.mockReturnValue({ id: 'user-id', email: 'user@example.com' });
    useSupabaseClient.mockReturnValue({
      storage: {
        from: jest.fn(() => ({
          list: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    expect(mockGetImages).toHaveBeenCalled();
  });

  test('handles error when fetching images', async () => {
    global.alert = jest.fn();
    useUser.mockReturnValue({ id: 'user-id', email: 'user@example.com' });
    useSupabaseClient.mockReturnValue({
      storage: {
        from: jest.fn(() => ({
          list: jest.fn().mockResolvedValue({ data: null, error: 'Error loading images' }),
        })),
      },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    expect(global.alert).toHaveBeenCalledWith('Error loading images');
  });
});
