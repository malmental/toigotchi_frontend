import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  PetDetailPage,
  CreatePetPage,
} from '@/pages'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <DashboardPage />
  }

  return <>{children}</>
}

function AppRoutes() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/login',
      element: <PublicRoute><LoginPage /></PublicRoute>,
    },
    {
      path: '/register',
      element: <PublicRoute><RegisterPage /></PublicRoute>,
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/pets/new',
      element: (
        <ProtectedRoute>
          <CreatePetPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/pets/:id',
      element: (
        <ProtectedRoute>
          <PetDetailPage />
        </ProtectedRoute>
      ),
    },
  ])

  return <RouterProvider router={router} />
}

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  )
}
