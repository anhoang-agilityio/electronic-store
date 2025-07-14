import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if credentials match mock user
        if (
          credentials.email === mockUser.email &&
          credentials.password === mockUser.password
        ) {
          return {
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
    updateAge: 6 * 60 * 60, // 6 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name!;
        session.user.email = token.email!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
});
