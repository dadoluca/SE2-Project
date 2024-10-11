import './App.css'
import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import CustomerMainboard from './pages/CustomerMainboard';
import Officer from './pages/Officer';
import DisplayScreen from './pages/DisplayScreen';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout/>,

      /* Loading errors of a valid route.
      This handles route loading errors and other server errors if not handled directly in components */
      errorElement: <ErrorPage/>,

      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/customer-mainboard",
          element: <CustomerMainboard />
        },
        {
          path: "/officer",
          element: <Officer />
        },
        {
          path: "/display-screen",
          element: <DisplayScreen />
        },
        {
          path: "*",
          element: <Navigate to="/" />
        }

      ],
    },
  
  ]);

  return <RouterProvider router={router} />;
}

export default App
