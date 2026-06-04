import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import SpacesPage from './pages/SpacesPage';
import ReservationsPage from './pages/ReservationsPage';
import WalkInPage from './pages/WalkInPage';
import KitchenPage from './pages/KitchenPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    // All standard routes share the Layout (NavBar + Footer)
    element: <Layout />,
    // 404 within the layout (unknown sub-paths under existing routes)
    errorElement: <NotFoundPage />,
    children: [
      { path: '/',             element: <HomePage /> },
      { path: '/menu',         element: <MenuPage /> },
      { path: '/spaces',       element: <SpacesPage /> },
      { path: '/reservations', element: <ReservationsPage /> },
      // Catch-all for any unknown path — renders inside the Layout
      { path: '*',             element: <NotFoundPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // /walk-in is the public Table Order page
    path: '/walk-in',
    element: <WalkInPage />,
  },
  {
    // /KitchenDisplay/aya is staff-only — heavily guarded by ProtectedRoute
    path: '/KitchenDisplay/aya',
    element: (
      <ProtectedRoute>
        <KitchenPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
