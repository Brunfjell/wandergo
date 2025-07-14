// src/pages/ErrorPage.jsx
import { useRouteError, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const ErrorPage = () => {
  const error = useRouteError();
  let title = 'Something went wrong!';
  let message = 'An unexpected error has occurred.';

  useEffect(() => {
    // Log error to error tracking service if you have one
    console.error(error);
  }, [error]);

  // Handle different error types
  if (error.status === 404) {
    title = 'Page Not Found';
    message = "The page you're looking for doesn't exist or has been moved.";
  }

  if (error.status === 401) {
    title = 'Unauthorized Access';
    message = 'You need to log in to access this page.';
  }

  if (error.status === 403) {
    title = 'Forbidden';
    message = "You don't have permission to access this resource.";
  }

  if (error.status === 500) {
    title = 'Server Error';
    message = 'Our servers encountered an error. Please try again later.';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="text-8xl font-bold text-blue-600">
            {error.status || 'Error'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-lg text-gray-600">{message}</p>
          
          {error.status === 401 ? (
            <Link
              to="/admin/login"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
          ) : (
            <Link
              to="/"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return Home
            </Link>
          )}

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
              <h3 className="font-medium text-gray-900">Error Details:</h3>
              <pre className="mt-2 text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;