import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ profile }) {
      // Validate ADMIN_EMAIL is configured
      if (!process.env.ADMIN_EMAIL) {
        console.error('[AUTH] ADMIN_EMAIL environment variable not configured')
        return false
      }

      // Get email from profile, handle case where it's not available
      const userEmail = profile?.email?.toLowerCase().trim() || ''
      const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim()

      // Validate email was returned by GitHub
      if (!userEmail) {
        console.warn(
          '[AUTH] GitHub profile email not available. User may have email set to private.'
        )
        return false
      }

      // Validate email matches admin email
      if (userEmail !== adminEmail) {
        console.warn(
          `[AUTH] Login rejected: ${userEmail} does not match configured admin email`
        )
        return false
      }

      console.log(`[AUTH] Successful login: ${userEmail}`)
      return true
    },
  },
})
