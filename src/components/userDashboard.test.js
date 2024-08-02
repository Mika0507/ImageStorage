import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDashboard from '../components/UserDashboard';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(),
}));

describe('UserDashboard', () => {
  const mockUser = { id: 'user-id', email: 'user@example.com' };
  const mockImages = [{ name: 'image1.jpg' }, { name: 'image2.jpg' }];
  const mockCDNURL = 'https://example.com/';
  const mockGetImages = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user dashboard correctly', () => {
    useSupabaseClient.mockReturnValue({
      auth: { signOut: jest.fn() },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          remove: jest.fn(),
        }),
      },
    });

    render(
      <UserDashboard
        user={mockUser}
        images={mockImages}
        CDNURL={mockCDNURL}
        getImages={mockGetImages}
      />
    );

    const titleText = (content, element) => {
      const hasText = (node) => node.textContent === 'Welcome to your Pickeeper wall!';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return elementHasText && childrenDontHaveText;
    };

    expect(screen.getByText(titleText)).toBeInTheDocument();
    expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('Use the Choose file button below to upload an image to your gallery')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(mockImages.length);
    expect(screen.getAllByRole('button', { name: 'Delete image' })).toHaveLength(mockImages.length);
  });

  test('calls signOut when sign out button is clicked', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    useSupabaseClient.mockReturnValue({
      auth: { signOut: mockSignOut },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          remove: jest.fn(),
        }),
      },
    });

    render(
      <UserDashboard
        user={mockUser}
        images={mockImages}
        CDNURL={mockCDNURL}
        getImages={mockGetImages}
      />
    );

    fireEvent.click(screen.getByText('Sign Out'));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalled());
  });

  test('calls uploadImage when file is selected', async () => {
    const mockUpload = jest.fn().mockResolvedValue({ data: {}, error: null });
    useSupabaseClient.mockReturnValue({
      auth: { signOut: jest.fn() },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: mockUpload,
          remove: jest.fn(),
        }),
      },
    });

    render(
      <UserDashboard
        user={mockUser}
        images={mockImages}
        CDNURL={mockCDNURL}
        getImages={mockGetImages}
      />
    );

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Use the Choose file button below to upload an image to your gallery/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(mockUpload).toHaveBeenCalled());
    expect(mockGetImages).toHaveBeenCalled();
  });

  test('calls deleteImage when delete button is clicked', async () => {
    const mockRemove = jest.fn().mockResolvedValue({ error: null });
    useSupabaseClient.mockReturnValue({
      auth: { signOut: jest.fn() },
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          remove: mockRemove,
        }),
      },
    });

    render(
      <UserDashboard
        user={mockUser}
        images={mockImages}
        CDNURL={mockCDNURL}
        getImages={mockGetImages}
      />
    );

    fireEvent.click(screen.getAllByText('Delete image')[0]);
    await waitFor(() => expect(mockRemove).toHaveBeenCalled());
    expect(mockGetImages).toHaveBeenCalled();
  });
});
