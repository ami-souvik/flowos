import type { NextAuthConfig } from "next-auth"
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      const isLoginPage = nextUrl.pathname.startsWith('/login');

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      if (isOnDashboard && !isLoggedIn && !isLoginPage) {
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
