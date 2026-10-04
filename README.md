# HavaRoof LLC website (Next.js + GSAP + three.js)

## Run it
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Make the contact form send email
Copy `.env.example` to `.env.local` and fill in ONE option:
- Resend: RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL once a domain is verified)
- Formspree: FORMSPREE_ENDPOINT
Set the same variables in your host (Vercel > Settings > Environment Variables).
Without them the form logs to the terminal in dev and shows a "call us" message in production.

Also set NEXT_PUBLIC_SITE_URL to the live domain so social previews work.

## Where to edit things
- Text, services, steps, gallery, phone, address: `data/site.js`
- Colours and type: top of `app/globals.css`
- 3D roof animation: `lib/roofScene.js`
- Photos/video: `public/images`, `public/video`

## Notes
- Google Map uses the keyless embed, so no API key is needed.
- Animations respect "reduce motion"; the 3D roof falls back to a photo if WebGL is unavailable.
