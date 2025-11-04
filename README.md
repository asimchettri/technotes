## TechNotes Frontend

React (Create React App) + Redux Toolkit Query + Tailwind CSS frontend for the TechNotes MERN project.

### Prerequisites
- Node.js 16+

### Installation
```bash
npm install
```

### Scripts
From `package.json`:
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

- `npm start`: start dev server on port 3000
- `npm run build`: production build to `build/`

### API Base URL
RTK Query is configured in `src/app/api/apiSlice.js`:
```js
const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-backend-ezom.onrender.com',
    credentials: 'include',
    // ...
})
```

- To use a local backend, change `baseUrl` to your API origin, e.g. `http://localhost:3500`.
- Cookies are sent with `credentials: 'include'`; ensure your backend CORS allows credentials and your origin.

### Auth & Refresh Flow
- Access token is attached via `Authorization: Bearer <token>` from Redux state
- On 403, the app calls `/auth/refresh` and retries automatically

### Styling
- Tailwind CSS configured in `tailwind.config.js` and `postcss.config.js`
- Global styles in `src/index.css`

### Project Structure (key parts)
```
src/
  app/
    api/apiSlice.js
    store.js
  components/
  config/roles.js
  features/
    auth/ (login, guards, slices)
    notes/ (CRUD screens & slices)
    stats/ (RTK Query slice)
    users/ (CRUD screens & slices)
  hooks/
  img/
  index.css
  index.js
public/
  index.html
```

### Running Locally
```bash
# from frontend/
npm start
```
Open `http://localhost:3000`.

If using the local backend:
- Update `src/app/api/apiSlice.js` `baseUrl` to `http://localhost:3500`
- Ensure backend CORS allows `http://localhost:3000` and `credentials: true`

### Libraries
- React 18, React Router 6
- Redux Toolkit + RTK Query
- Tailwind CSS, PostCSS, Autoprefixer
- Icons: Font Awesome, React Icons, Lucide
- Animations: Framer Motion

### Production Build
```bash
npm run build
```
Outputs optimized assets in `build/` for deployment.

