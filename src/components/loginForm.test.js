import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

test('renders login form and calls signInWithOtp on submit', async () => {
  const mockSignInWithOtp = jest.fn().mockResolvedValue({ error: null });
  const mockSetIsLoading = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSupabase = {
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  };

  const { rerender } = render(
    <LoginForm
      email=""
      setEmail={mockSetEmail}
      isLoading={false}
      setIsLoading={mockSetIsLoading}
      supabase={mockSupabase}
    />
  );

  const emailInput = screen.getByPlaceholderText('Enter email');
  const submitButton = screen.getByText('Get Magic Link');

  // Simular la entrada de email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');

  // Volver a renderizar el componente con el nuevo valor de email
  rerender(
    <LoginForm
      email="test@example.com"
      setEmail={mockSetEmail}
      isLoading={false}
      setIsLoading={mockSetIsLoading}
      supabase={mockSupabase}
    />
  );

  // Simular el envío del formulario
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockSignInWithOtp).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  // Verificar que el mensaje de éxito aparece
  expect(await screen.findByText('Check your email for a Supabase Magic Link to Log In!')).toBeInTheDocument();
});

test('handles error when signInWithOtp fails', async () => {
  const mockSignInWithOtp = jest.fn().mockRejectedValue(new Error('API Error'));
  const mockSetIsLoading = jest.fn();
  const mockSupabase = {
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  };

  render(
    <LoginForm
      email="test@example.com"
      setEmail={() => {}}
      isLoading={false}
      setIsLoading={mockSetIsLoading}
      supabase={mockSupabase}
    />
  );

  const submitButton = screen.getByText('Get Magic Link');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockSignInWithOtp).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(screen.getByText('Error communicating with supabase. Please try again later')).toBeInTheDocument();
  });
});
