import previewEmail from "preview-email"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/reset-password?token=${token}`

  return {
    async send() {

        // Preview email in the browser
        await previewEmail({
          from: "TODO@example.com",
          to,
          subject: "Your Password Reset Instructions",
          html: `
            <h1>Reset Your Password</h1>      
            <a href="${resetUrl}">
              Click here to set a new password
            </a>
          `,
        })
      
    },
  }
}
