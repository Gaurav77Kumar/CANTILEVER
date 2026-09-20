# Openbook Blog

A React + Express + MongoDB blog with registration, login/logout, and authenticated post CRUD.

## Run locally

1. Install MongoDB and make sure it is running.
2. Create `server/.env` from `server/.env.example` and set a strong `JWT_SECRET`.
3. In one terminal:

```sh
cd server
npm install
npm run dev
```

4. In another terminal:

```sh
cd client
npm install
npm run dev
```

The client runs at `http://localhost:5173`. Set `client/.env` from `client/.env.example` when the API is not on the default URL.
