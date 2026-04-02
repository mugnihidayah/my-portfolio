<div align="center">

# Mugni Hidayah Portfolio

### Interactive AI Engineer Workspace

[![Live Site](https://img.shields.io/badge/Live-mugnihidayah-007ACC?style=for-the-badge&logo=vercel&logoColor=white)](https://mugnihidayah.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-AI%20Chat-F55036?style=for-the-badge)](https://groq.com)
[![Resend](https://img.shields.io/badge/Resend-Contact%20Email-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com)

**A VS Code-inspired portfolio experience for showcasing AI engineering projects, technical work, and professional artifacts in a desktop-like web interface.**

[Features](#features) | [Quick Start](#quick-start) | [Architecture](#architecture) | [API Routes](#api-routes) | [Tech Stack](#tech-stack) | [Deployment](#deployment)


</div>

---

## Features

- VS Code-style workspace with title bar, activity bar, explorer, tabs, editor layout, terminal, and status bar
- Dedicated pages for projects, project detail views, skills, experience, about, contact, and resume
- AI portfolio assistant powered by Groq for interactive Q&A
- Contact form delivery with Resend
- Mobile-optimized layout with adapted navigation, panel behavior, and chat interactions
- Rich project detail pages with case studies, trust signals, architecture diagrams, artifacts, and embedded demos
- GitHub coding activity visualization served through internal API routes
- Theme switching with multiple editor-inspired themes
- Production-oriented hardening including security headers and API rate limiting

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

```bash
git clone <your-repo-url>
cd web-portfolio
npm install
```

Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_VERIFIED_EMAIL=your_verified_email
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Architecture

This project is built with the Next.js App Router and structured like a lightweight developer workspace rather than a conventional landing page.

### Core Structure

- `src/app` - app entrypoints, metadata, global styles, and API routes
- `src/components` - page components, layout primitives, chat UI, and shared interface pieces
- `src/context` - app-wide client state for tabs, theme, toast, and chat behavior
- `src/data` - structured portfolio content such as profile, projects, skills, and experience
- `src/lib` - shared utilities including prompt generation, GitHub activity parsing, and rate limiting
- `public` - resume, project images, icons, OG assets, and supporting static files

### Product Direction

This repository is designed to work as both:

- a personal portfolio for recruiters, collaborators, and clients
- a polished frontend product that demonstrates custom interaction design and light full-stack capability

---

## API Routes

The application includes a few server routes for interactive features:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/chat` | Validates chat messages, applies rate limiting, and forwards requests to Groq |
| `POST` | `/api/contact` | Validates contact form submissions and sends email through Resend |
| `GET` | `/api/github/[username]` | Fetches and parses GitHub contribution activity |
| `GET` | `/api/codeactivity/[username]` | Compatibility alias for the GitHub activity route |

---

## Tech Stack

- Framework: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS 4, custom design system utilities
- UI Primitives: Radix UI, shadcn/ui
- Motion and Interaction: GSAP, Lucide React, XYFlow, React Three Fiber ecosystem
- AI Integration: Groq API
- Email: Resend
- Rate Limiting: Upstash Redis REST API with in-memory local fallback

---

## Scripts

```bash
npm run dev
```

Start the local development server.

```bash
npm run build
```

Create a production build.

```bash
npm run start
```

Run the production build locally.

```bash
npm run lint
```

Run ESLint.

```bash
npm test
```

Run the current automated tests for the chat route and rate limiting logic.

---

## Environment Variables

```env
# Required for AI chat
GROQ_API_KEY=

# Required for contact form
RESEND_API_KEY=

# Optional override for contact destination
RESEND_VERIFIED_EMAIL=

# Recommended for durable production rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Notes:

- `GROQ_API_KEY` is required if you want the AI assistant to work.
- `RESEND_API_KEY` is required if you want the contact form to send email.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are optional in local development, but recommended in production.
- Without Upstash configured, the application falls back to an in-memory rate limiter.

---

## Security

The project includes several practical hardening measures:

- global security headers configured through Next.js
- content security policy and browser policy headers
- rate limiting for public API routes
- server-side handling of third-party credentials
- sanitized contact form content before email rendering
- privacy-friendlier YouTube embed handling for project demos

---

### Production Checklist

- configure all required environment variables
- use Upstash for consistent multi-instance rate limiting
- verify Groq and Resend integrations after deployment
- run `npm run build` before pushing major changes

---

## Known Notes

- The AI assistant and contact form depend on external services and environment variables.
- The GitHub activity widget depends on GitHub contribution markup and may reflect GitHub's own update timing.
- The current test suite is intentionally lightweight and focused on backend utility logic rather than UI testing.

---

## Usage and Reuse

This repository is maintained as a personal portfolio. You are welcome to learn from the structure and implementation, but direct reuse of personal branding, content, and assets should be avoided without permission.
