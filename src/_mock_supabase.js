const mockSupabaseClient = {
    auth: {
      signInWithOtp: jest.fn(),
      signOut: jest.fn(),
    },
    storage: {
      from: jest.fn(() => ({
        list: jest.fn(),
        upload: jest.fn(),
        remove: jest.fn(),
      })),
    },
  };
  
  export const useSupabaseClient = () => mockSupabaseClient;
  export const useUser = () => ({ id: 'user-id', email: 'user@example.com' });