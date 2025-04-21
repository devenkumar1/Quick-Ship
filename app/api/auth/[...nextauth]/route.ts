import NextAuth from "next-auth";
import authOptions from '@/lib/auth';
export const runtime = 'nodejs';

const handler = NextAuth({
	...authOptions,
	session: {
		strategy: "jwt"
	}
});

export { handler as GET, handler as POST };
