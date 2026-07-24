import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "kene-secret-key-2026",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Téléphone", type: "text", placeholder: "07070707" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
          include: { roles: true }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        // Return user object, mapping roles for session
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          image: user.avatarUrl,
          // Custom properties
          roles: user.roles.map(r => ({ tenantId: r.tenantId, role: r.role }))
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
