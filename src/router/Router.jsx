import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/book-now',
    element: <AppointmentForm />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/thank-you',
    element: <ThankYou />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: '/admin/manage-services',
    element: <PrivateRoute><ManageServices /></PrivateRoute>,
  },
  {
    path: '/admin/manage-appointments',
    element: <PrivateRoute><ManageAppointments /></PrivateRoute>,
  },
  {
    path: '/admin/manage-messages',
    element: <PrivateRoute><ManageMessages /></PrivateRoute>,
  },
  {
    path: '/admin/analytics',
    element: <PrivateRoute><Analytics /></PrivateRoute>,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}