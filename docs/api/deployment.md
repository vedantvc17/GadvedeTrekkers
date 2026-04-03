# API Deployment Notes

## Frontend

Set these variables in the frontend deployment environment:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_ADMIN_API_KEY=your-admin-api-key
```

If `VITE_API_BASE_URL` is not set, the frontend falls back to relative `/api/...` requests.
That only works when the frontend host also proxies `/api/*` to the backend.

## Backend

Set these variables in the backend deployment environment:

```env
PORT=4000
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_API_KEY=...
CORS_ORIGIN=http://localhost:5173,https://gadvede.com,https://www.gadvede.com
```

`CORS_ORIGIN` supports comma-separated values.

## Current API expectations

- Public enquiries are posted to `/api/enquiries`
- Legacy lead submissions to `/api/leads` are also accepted
- Admin product CRUD uses `/api/products/admin/*`

## Recommended production setup

1. Deploy the backend as a separate public service.
2. Point `VITE_API_BASE_URL` at that backend service.
3. Keep all frontend API calls going through `src/api/backendClient.js`.
4. Treat route aliases like `/api/leads` as compatibility shims, not primary APIs.
