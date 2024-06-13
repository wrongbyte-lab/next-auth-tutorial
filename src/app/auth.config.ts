import type { NextAuthConfig } from 'next-auth';
const { AUTH_SECRET } = process.env;

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    /**
     * Guard the protected pages and redirect the user to login page if false (user not authenticated).
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log("auth user:", auth?.user);

      const isProtectedRoute = nextUrl.pathname.startsWith('/perfil');

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    /**
     * Receives the user returned from the signIn function. This is triggered every time a user logs in
     */
    jwt: async ({ token, user }) => {
      if (user) {
        console.log("jwt user", user);
        token.email = user.email;
        token.name = user.name;
        token.sub = user.id;
        
      }
      return token
    },
    /**
     * Sets the session object from the information set in the token. `useSession()` 
     * client-side hook will get its info through this function.
     */
    session: async ({ session, token }) => {
      if (token) {
        session.user.email = token.email!;
        session.user.id = token.sub!;
        session.user.name = token.name;

      } else {
      }
      return Promise.resolve(session)
    }
  },
  providers: [],
  secret: AUTH_SECRET,
} satisfies NextAuthConfig;

