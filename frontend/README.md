# DOBATO Frontend — Production Deployment Guide

DOBATO is a Nepali meaningful-connection/dating platform.

## 🚀 Production Build & Deployment

### Deployment Specs
- **Node Version**: 18+ or 20+ LTS
- **Package Manager**: `npm`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables
Configure the following in your hosting provider (Vercel, Netlify, Cloudflare Pages, Nginx):

```env
VITE_API_BASE_URL=https://api.dobato.app/api/v1
VITE_PUBLIC_WEB_URL=https://dobato.app
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

### SPA Routing Fallback
Ensure all requests resolve to `/index.html` so client-side routing works for public and admin pages (`/event`, `/poetry`, `/register`, `/admin`, `/admin/login`).

- **Netlify**: Configured via `public/_redirects`
- **Vercel**: Configured via `vercel.json`
- **Nginx**: `try_files $uri $uri/ /index.html;`

### Quality Assurance Commands
- `npm run dev` — Local development server
- `npm run build` — TypeScript check and production bundle compilation
- `npm run preview` — Local preview of production build
