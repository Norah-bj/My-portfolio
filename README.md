# Nora's Portfolio

An interactive portfolio built with React, TypeScript, Vite, and React Three Fiber. It combines a scroll driven 3D scene with project, skills, and contact sections.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
npm install
npm run dev
```

## Build for production

```sh
npm run build
npm run preview
```

The production site is generated in `dist/`. The app is a static single page application and can be deployed to Cloudflare Pages. Use `npm run build` as the build command and `dist` as the output directory.

Set the `SITE_URL` build environment variable to the final production origin, such as `https://example.com`. The build uses it for the canonical URL, Open Graph URL, Person structured data, `sitemap.xml`, and the sitemap entry in `robots.txt`. Leave it unset on local development and preview builds; without it the sitemap is not generated.

## Performance notes

The 3D sections load as separate chunks when the camera approaches them. Off-screen 3D sections are unmounted, background tabs stop rendering, and the renderer uses a capped pixel ratio to reduce GPU work. Check real-device loading and frame rate after deployment; bundle size alone cannot confirm Core Web Vitals or smooth frame rates.

## Deployment

Connect this repository to Cloudflare Pages. Configure the build command as `npm run build`, the output directory as `dist`, and `SITE_URL` as a production-only environment variable containing the final HTTPS origin. Keep preview builds on Cloudflare Pages' default `noindex` behavior.

## Project structure

- `src/ui/` contains the accessible DOM interface and sections.
- `src/three/` contains the WebGL scene and 3D objects.
- `src/data/` contains portfolio content.
- `src/choreography.ts` coordinates page and scroll animations.
