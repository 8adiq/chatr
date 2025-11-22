# Required Vercel Environment Variables

## Setup Instructions

Go to your Vercel project settings:
**https://vercel.com/sadiqs-projects-6565ed92/chatr/settings/environment-variables**

Add the following environment variables for **Production** environment:

## Required Variables

### 1. SECRET_KEY
**Value:** Generate a new secure key
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
**Example:** `sA3Tx14UuW9bM5YqFgx7N9yZGVVUqpqCGlTzV_4Fy1Q`

### 2. DATABASE_URL
**Value:** Your PostgreSQL connection string
```text
postgresql://postgres:[YOUR_PASSWORD]@db.aiwngllyoigzhkwppsza.supabase.co:5432/postgres
```
**Note:** Remove the duplicate `DATABASE_URL=` prefix if copying from your local .env file

### 3. CORS_ALLOWED_ORIGINS
**Value:** Your Vercel frontend URL
```text
https://chatr-kappa.vercel.app
```
**Note:** Update this to match your actual Vercel domain

### 4. ACCESS_TOKEN_EXPIRES_MINUTES
**Value:** `30`

### 5. REFRESH_TOKEN_EXPIRES_DAYS
**Value:** `7`

### 6. SMTP_HOST
**Value:** `smtp.gmail.com`

### 7. SMTP_PORT
**Value:** `465`

### 8. SMTP_USERNAME
**Value:** Your Gmail address
```
abdullatifsadiq21@gmail.com
```

### 9. SMTP_PASSWORD
**Value:** Your Gmail app password
```
rwadabgcnlfsaxds
```

### 10. SMTP_ADMIN_EMAIL
**Value:** Admin email for notifications
```
abdullatifsadiq21@outlook.com
```

### 11. SMTP_DEFAULT_FROM_EMAIL
**Value:** Default sender email
```
abdullatifsadiq21@gmail.com
```

## Quick Add via Vercel CLI (Optional)

You can also add these via command line:

```bash
vercel env add SECRET_KEY production
# Then paste the value when prompted

vercel env add DATABASE_URL production
# Then paste the value when prompted

vercel env add CORS_ALLOWED_ORIGINS production
# Then paste: https://chatr-kappa.vercel.app

vercel env add ACCESS_TOKEN_EXPIRES_MINUTES production
# Then paste: 30

vercel env add REFRESH_TOKEN_EXPIRES_DAYS production
# Then paste: 7

vercel env add SMTP_HOST production
# Then paste: smtp.gmail.com

vercel env add SMTP_PORT production
# Then paste: 465

vercel env add SMTP_USERNAME production
# Then paste your email

vercel env add SMTP_PASSWORD production
# Then paste your app password

vercel env add SMTP_ADMIN_EMAIL production
# Then paste admin email

vercel env add SMTP_DEFAULT_FROM_EMAIL production
# Then paste default from email
```

## Verification

After adding all variables:
1. Go to Settings → Environment Variables
2. Verify all 11 variables are listed
3. Redeploy your application: `vercel --prod`

## Security Notes

- ⚠️ **NEVER** commit the `.env` file to Git
- ⚠️ **ROTATE** credentials that were exposed in version control
- ⚠️ Use Vercel's encrypted environment variables for all secrets
- ⚠️ Generate a NEW `SECRET_KEY` for production (don't reuse local dev key)
