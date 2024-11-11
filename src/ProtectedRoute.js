import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userRole = localStorage.getItem('role');

  if (!accessToken || !refreshToken || userRole !== role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;