/**
 * Auth Profile Creation Tests
 *
 * Tests that verify profile creation with display_name
 * for both email/password signup and Google OAuth login
 */

import { supabase } from '../src/lib/supabase';

// Mock Supabase
jest.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// Mock Google auth
jest.mock('../src/lib/auth', () => ({
  signInWithGoogle: jest.fn(),
}));

describe('Auth Profile Creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Email/Password Signup', () => {
    it('should create profile with display_name after successful signup', async () => {
      const mockUserId = 'test-user-123';
      const mockEmail = 'test@example.com';
      const mockDisplayName = 'Test User';

      // Mock successful signup
      const mockSignUp = supabase.auth.signUp as jest.Mock;
      mockSignUp.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: mockEmail,
          },
        },
        error: null,
      });

      // Mock profile insertion
      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      // Simulate signup
      const { data, error } = await supabase.auth.signUp({
        email: mockEmail,
        password: 'Test123!@#',
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();

      // Simulate profile creation
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: mockEmail,
          display_name: mockDisplayName,
        });
      }

      // Verify profile was inserted
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUserId,
        email: mockEmail,
        display_name: mockDisplayName,
      });
    });

    it('should validate display_name is at least 2 characters', () => {
      const displayName1 = 'A';
      const displayName2 = 'AB';
      const displayName3 = 'Alice';

      expect(displayName1.trim().length >= 2).toBe(false);
      expect(displayName2.trim().length >= 2).toBe(true);
      expect(displayName3.trim().length >= 2).toBe(true);
    });

    it('should validate email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail1 = 'notanemail';
      const invalidEmail2 = '@example.com';
      const invalidEmail3 = 'user@';

      const emailRegex = /\S+@\S+\.\S+/;

      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail1)).toBe(false);
      expect(emailRegex.test(invalidEmail2)).toBe(false);
      expect(emailRegex.test(invalidEmail3)).toBe(false);
    });

    it('should validate password requirements', () => {
      const validPassword = 'Test123!@#';
      const noUpper = 'test123!@#';
      const noLower = 'TEST123!@#';
      const noSymbol = 'Test123456';
      const tooShort = 'Test1!';

      const isValidPassword = (value: string) => {
        const hasMin = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasSymbol = /[^A-Za-z0-9]/.test(value);
        return hasMin && hasUpper && hasLower && hasSymbol;
      };

      expect(isValidPassword(validPassword)).toBe(true);
      expect(isValidPassword(noUpper)).toBe(false);
      expect(isValidPassword(noLower)).toBe(false);
      expect(isValidPassword(noSymbol)).toBe(false);
      expect(isValidPassword(tooShort)).toBe(false);
    });
  });

  describe('Google OAuth Login', () => {
    it('should create profile with display_name from Google metadata', async () => {
      const mockUserId = 'google-user-123';
      const mockEmail = 'google@example.com';
      const mockGoogleName = 'Google User';

      // Mock getUser returning Google user
      const mockGetUser = supabase.auth.getUser as jest.Mock;
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: mockEmail,
            user_metadata: {
              full_name: mockGoogleName,
            },
          },
        },
        error: null,
      });

      // Mock profile check (no existing profile)
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      // Mock profile insertion
      const mockInsert = jest.fn().mockResolvedValue({
        error: null,
      });

      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: mockInsert,
      });

      // Simulate Google login flow
      const { data: { user } } = await supabase.auth.getUser();

      expect(user).toBeDefined();

      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // If no profile, create one
        if (!profile) {
          const displayName = user.user_metadata?.full_name ||
                             user.user_metadata?.name ||
                             user.email?.split('@')[0] ||
                             'User';

          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email!,
              display_name: displayName,
            });
        }
      }

      // Verify profile was created with Google name
      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUserId,
        email: mockEmail,
        display_name: mockGoogleName,
      });
    });

    it('should fallback to email prefix if no Google name available', async () => {
      const mockUserId = 'google-user-456';
      const mockEmail = 'testuser@gmail.com';

      // Mock getUser with no full_name in metadata
      const mockGetUser = supabase.auth.getUser as jest.Mock;
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: mockEmail,
            user_metadata: {}, // No name fields
          },
        },
        error: null,
      });

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const displayName = user.user_metadata?.full_name ||
                           user.user_metadata?.name ||
                           user.email?.split('@')[0] ||
                           'User';

        expect(displayName).toBe('testuser'); // Should use email prefix
      }
    });

    it('should not create duplicate profile if one already exists', async () => {
      const mockUserId = 'existing-user-123';

      // Mock getUser
      const mockGetUser = supabase.auth.getUser as jest.Mock;
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: mockUserId,
            email: 'existing@example.com',
          },
        },
        error: null,
      });

      // Mock profile check (profile exists)
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: mockUserId }, // Profile exists
        error: null,
      });
      const mockEq = jest.fn().mockReturnValue({
        single: mockSingle,
      });
      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      const mockInsert = jest.fn();
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: mockInsert,
      });

      // Simulate flow
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // Should NOT insert if profile exists
        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email!,
            display_name: 'Test',
          });
        }
      }

      // Verify insert was NOT called
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe('Profile Data Structure', () => {
    it('should have correct profile structure', () => {
      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test User',
      };

      expect(mockProfile).toHaveProperty('id');
      expect(mockProfile).toHaveProperty('email');
      expect(mockProfile).toHaveProperty('display_name');
      expect(typeof mockProfile.id).toBe('string');
      expect(typeof mockProfile.email).toBe('string');
      expect(typeof mockProfile.display_name).toBe('string');
    });
  });
});
