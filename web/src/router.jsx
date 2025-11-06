import { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

import Loader from '@/components/Loader/Loader';
import { BASE_ROUTE, ROUTE } from '@/config/routes';
import AuthGuard from '@/guards/AuthGuard';

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, idx) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={idx}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>
                  {!route.routes?.length
                    ? <Element />
                    : renderRoutes(route.routes)
                  }
                </Layout>
              </Guard>
            }
          />
        )
      })}
    </Routes>
  </Suspense>
)

export const routes = [
  {
    exact: 'true',
    path: '/',
    element: lazy(() => import('@/pages/auth/signin'))
  },
  {
    exact: 'true',
    path: `/${BASE_ROUTE.AUTH}/${ROUTE.SIGNIN}`,
    element: lazy(() => import('@/pages/auth/signin'))
  },
  {
    exact: 'true',
    path: `/${BASE_ROUTE.AUTH}/${ROUTE.RESET_PASSWORD}`,
    element: lazy(() => import('@/pages/auth/reset-password'))
  },
  {
    path: `/${BASE_ROUTE.APP}/*`,
    layout: lazy(() => import('@/layouts/AppLayout')),
    guard: AuthGuard,
    routes: [
      {
        exact: 'true',
        path: `/${ROUTE.DASHBOARD}`,
        element: lazy(() => import('@/pages/dashboard'))
      },
      {
        path: `/${BASE_ROUTE.SETTINGS}/*`,
        routes: [
          {
            exact: 'true',
            path: `/${ROUTE.PAYMENT_ACCOUNTS}`,
            element: lazy(() => import('@/pages/maintenance/payment-accounts'))
          },
          {
            exact: 'true',
            path: `/${ROUTE.VEHICLES}`,
            element: lazy(() => import('@/pages/maintenance/vehicles'))
          },
          {
            exact: 'true',
            path: `/${ROUTE.VEHICLES}/:plate`,
            element: lazy(() => import('@/pages/maintenance/vehicles/vehicle'))
          },
          {
            path: '*',
            exact: 'true',
            element: () => <Navigate to={`/${BASE_ROUTE.APP}/${ROUTE.DASHBOARD}`} />
          }
        ]
      },
      {
        path: `/${BASE_ROUTE.PEOPLE}/*`,
        routes: [
          {
            exact: 'true',
            path: `/${ROUTE.CUSTOMERS}`,
            element: lazy(() => import('@/pages/customers'))
          },
          {
            exact: 'true',
            path: `/${ROUTE.PASSENGERS}`,
            element: lazy(() => import('@/pages/people/passengers'))
          },
          {
            exact: 'true',
            path: `/${ROUTE.DRIVERS}`,
            element: lazy(() => import('@/pages/people/drivers'))
          },
          {
            exact: 'true',
            path: `/${ROUTE.GUIDES}`,
            element: lazy(() => import('@/pages/people/guides'))
          },
        ]
      },
      {
        exact: 'true',
        path: `/${ROUTE.TOURS}`,
        element: lazy(() => import('@/pages/tours'))
      },
      {
        exact: 'true',
        path: `/${ROUTE.RESERVATIONS}`,
        element: lazy(() => import('@/pages/reservations'))
      },
      {
        exact: 'true',
        path: `/${ROUTE.RESERVATION_PAYMENTS}`,
        element: lazy(() => import('@/pages/treasury/reservation-payments'))
      },
      {
        exact: 'true',
        path: `/${ROUTE.TERMS}`,
        element: lazy(() => import('@/pages/Terms'))
      },
      {
        exact: 'true',
        path: `/${ROUTE.PROFILE}`,
        element: lazy(() => import('@/pages/profile'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={`/${BASE_ROUTE.APP}/${ROUTE.DASHBOARD}`} />
      }
    ]
  },
  {
    path: '*',
    exact: 'true',
    element: lazy(() => import('@/pages/NotFound'))
  }
];

export default renderRoutes;
