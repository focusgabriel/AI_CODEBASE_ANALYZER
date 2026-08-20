const verificationTemplate = (verificationLink: string, newUser: string) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f5f7fb; padding:24px; color:#111827;">
      <div style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(15, 23, 42, 0.08);">
        <div style="background:linear-gradient(90deg, #4338ca 0%, #4f46e5 100%); padding:28px 32px;">
          <h2 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">Welcome to PlainSight, ${newUser}👋</h2>
        </div>

        <div style="padding:32px; line-height:1.6; font-size:15px; color:#374151;">
          <p style="margin:0 0 12px;">Thanks for signing up with PlainSight. Please verify your email by clicking the button below.</p>
          <div style="margin:24px 0;">
            <a
              href="${verificationLink}"
              style="
                display:inline-block;
                padding:13px 24px;
                background:#4338ca;
                color:#ffffff;
                text-decoration:none;
                border-radius:999px;
                font-weight:700;
                font-size:15px;
              "
            >
              Verify my account
            </a>
          </div>

          <p style="margin:20px 0 0; font-size:13px; color:#6b7280;">
            If you did not create this account, you can safely ignore this email.
          </p>

        </div>
      </div>
    </div>
  `;
};

export default verificationTemplate;
