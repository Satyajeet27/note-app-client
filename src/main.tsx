import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './AppLayout.tsx'
import PrivateRoute from './PrivateRoute/PrivateRoute.tsx'
import Landing from './pages/Landing.tsx'
import Auth from './pages/Auth.tsx'
import { AuthContextProvider } from './context/AuthContextProvider.tsx'
import { NotesContextProvider } from './context/NotesContextProvider.tsx'
import Profile from './pages/Profile.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <PrivateRoute><Landing /></PrivateRoute> },
      { path: "/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
      { path: "/auth", element: <Auth /> },
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NotesContextProvider>

          <RouterProvider router={router} />
        </NotesContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
