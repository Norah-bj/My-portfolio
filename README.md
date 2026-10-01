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

The production site is generated in `dist/`. The app is a static single page application and can be deployed to a static host. Use `npm run build` as the build command and `dist` as the output directory.

## Performance notes

The 3D scene is loaded separately from the main interface and uses a lower quality setting on mobile and lower core-count devices. The production build still reports a large scene chunk because Three.js and all scene objects are bundled together. Check real-device loading and frame rate before calling performance complete; see the Vite build output for current bundle sizes.

## Deployment

Connect this repository to a static host such as Cloudflare Pages or Vercel. Configure the build command as `npm run build` and the output directory as `dist`. Enable preview deployments for pull requests so changes can be reviewed before release.

## Project structure

- `src/ui/` contains the accessible DOM interface and sections.
- `src/three/` contains the WebGL scene and 3D objects.
- `src/data/` contains portfolio content.
- `src/choreography.ts` coordinates page and scroll animations.
