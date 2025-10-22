# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deployment notes (Vercel frontend + Render backend)

Short steps to deploy this project with frontend on Vercel and backend on Render:

- Frontend (Vercel):
	1. Connect your GitHub repo to Vercel and select this project.
	2. In Vercel project Settings -> Environment Variables add:
		 - Key: `VITE_API_BASE_URL`
		 - Value: `https://<your-render-app>.onrender.com` (no trailing slash)
	3. Build command: `npm run build` (Vite will use the injected env var). Deploy.

- Backend (Render):
	1. Create a new Web Service on Render and connect the backend repo (or push your server code).
	2. Ensure it listens on the port Render provides (process.env.PORT) and exposes your API under `/api`.
	3. After deploy, copy the service URL and set it as `VITE_API_BASE_URL` in Vercel.

Local development:

- By default the frontend will point to `http://localhost:10000` when running in development if `VITE_API_BASE_URL` is not set. You can also create a `.env` file with `VITE_API_BASE_URL` to override.

See `.env.example` for an example variable name.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
