import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import AdminPage from './pages/AdminPage/AdminPage';
import LivePage from './pages/LivePage/LivePage';
import LoginPage from './pages/LoginPage/LoginPage';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import SignupPage from './pages/SignupPage/SignupPage';
import StartPage from './pages/StartPage/StartPage';
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const routes = createBrowserRouter([
    {
      element: <Layout isLoading={isLoading} />,
      children: [
        {
          element: <StartPage />,
          path: '/',
        },
        {
          element: <SignupPage />,
          path: '/signup',
        },
        {
          element: <LoginPage setIsLoading={setIsLoading} />,
          path: '/login',
        },
        {
          element: <PlayerPage />,
          path: '/player',
        },
        {
          element: <AdminPage />,
          path: '/admin',
        },
        {
          element: <ResultsPage />,
          path: '/admin/results',
        },
        {
          element: <LivePage />,
          path: '/admin/live',
        },
        {
          element: <LivePage />,
          path: '/player/live',
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
