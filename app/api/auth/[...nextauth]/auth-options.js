import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userid: { label: 'NIK / User ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'boolean' },
      },
      async authorize(credentials) {
        if (!credentials?.userid || !credentials?.password) {
          throw new Error(
            JSON.stringify({
              code: 400,
              message: 'NIK/User ID dan password wajib diisi.',
            }),
          );
        }

        const apiBase =
          process.env.PRIME_API_URL ||
          process.env.NEXT_PUBLIC_PRIME_API_URL ||
          'http://localhost:3001/v1';
        const response = await fetch(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: credentials.userid,
            password: credentials.password,
          }),
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.user) {
          throw new Error(
            JSON.stringify({
              code: response.status || 500,
              message:
                payload?.message ||
                'Login gagal. Pastikan API dan koneksi jaringan aktif.',
            }),
          );
        }

        return {
          ...payload.user,
          accessToken: payload.authToken,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update' && session?.user) {
        token = session.user;
      } else if (user) {
        token.id = user.id || token.sub;
        token.userid = user.userid;
        token.email = user.email;
        token.name = user.name;
        token.avatar = user.avatar;
        token.plant = user.plant;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.userid = token.userid;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
        session.user.plant = token.plant;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

export default authOptions;
