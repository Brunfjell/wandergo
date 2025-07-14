import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLayout from '../admin/AdminLayout';
import Home from '../pages/Home';
import Services from '../pages/Services';
import AppointmentForm from '../pages/AppointmentForm';
import Contact from '../pages/Contact';
import ThankYou from '../pages/ThankYou';
import AdminLogin from '../admin/AdminLogin';
import Dashboard from '../admin/Dashboard';
import ManageServices from '../admin/ManageServices';
import ManageAppointments from '../admin/ManageAppointments';
import ManageMessages from '../admin/ManageMessages';
import Analytics from '../admin/Analytics';
import PrivateRoute from './PrivateRoute';
import ErrorPage from '../pages/ErrorPage';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'book-now',
        element: <AppointmentForm />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'thank-you',
        element: <ThankYou />,
      },
    ],
  },
  {
    path: '/admin',
    element: <PrivateRoute><AdminLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'manage-services',
        element: <ManageServices />,
      },
      {
        path: 'manage-appointments',
        element: <ManageAppointments />,
      },
      {
        path: 'manage-messages',
        element: <ManageMessages />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}