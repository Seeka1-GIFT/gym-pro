import { useNavigate } from 'react-router-dom';
import Login from './Login';

/**
 * Lazy loaded routes for auth features. Redirects to dashboard on login.
 */
export default function AuthRoutes() {
  const nav = useNavigate();
  return <Login onSuccess={() => nav('/')} />;
}