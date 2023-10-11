import { ADMIN_APP_ROUTES, ANONYMOUS_ROUTES, STUDENT_APP_ROUTES } from 'app/AppRoutes';
import { IAppRoute } from 'common/types/Routers';
import { LazyExoticComponent, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import AdminLayout from './layout/AdminLayout';
import StudentLayout from './layout/StudentLayout';

export const renderPage = (PageComponent: LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<></>}>
    <PageComponent />
  </Suspense>
);

export const renderAppRoute = (appRoute: IAppRoute) => {
  const RouteKeys = Object.keys(appRoute) as Array<string | number>;

  return RouteKeys.length > 0
    ? RouteKeys.map((routeKey) => {
        const route = appRoute[routeKey];
        return <Route key={route.path} path={route.path} element={renderPage(route.component)} />;
      })
    : null;
};

const AppRouter = () => {
  return (
    <Router>
      <ScrollToTop>
        <Routes>
          {renderAppRoute(ANONYMOUS_ROUTES)}
          {/* ADMIN ROUTERS */}
          <Route path="/" element={<AdminLayout />}>
            {renderAppRoute(ADMIN_APP_ROUTES)}
          </Route>
          {/* STUDENT ROUTERS */}
          <Route path="/student" element={<StudentLayout />}>
            {renderAppRoute(STUDENT_APP_ROUTES)}
          </Route>
        </Routes>
      </ScrollToTop>
    </Router>
  );
};

export default AppRouter;
