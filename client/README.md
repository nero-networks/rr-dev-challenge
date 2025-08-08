# rr DEV Challenge - frontend

SvelteKit web interface for timetable informations of public transport.


## Tech Stack
- **Framework**: [SvelteKit](https://svelte.dev/docs/kit/introduction)
- **Language**: TypeScript
- **Styling**: CSS with mini.css


## Quick Start
```bash
npm install
npm run build
npm run preview
```

The preview frontend runs on **http://localhost:4173/**


## Environment Variables
By default the Api base URL of the backend is http://localhost:3000

this can be overridden with a `.env` file placed in the client directory
```
PUBLIC_API_BASE_URL=http://localhost:3001
```
or by declaring the environment variable on the commandline
```
$ PUBLIC_API_BASE_URL=http://localhost:3002 npm run preview
```

## Next steps
- auto-refresh
- schedule details view (operator, planned time, arriving platform, capacity, route, ...)
- filter persistence (local-storage)
- responsiveness
- tests
- i18n
- prod build
- end-user help / mouse-over hints
