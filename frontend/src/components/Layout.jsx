import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import _ from 'lodash';
import Loader from './Loader';

export const Layout = ({ isLoading }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="layout-container">
      <ToastContainer />
      {isLoading && <Loader />}
      {sessionStorage.getItem('user') && (
        <div className="layout-top-bar">
          <div className="user-greet">
            {`Hi ${_.capitalize(
              JSON.parse(sessionStorage.getItem('user')).username
            )}`}
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
      <div className="layout-content">
        <Outlet key={location.pathname} />
      </div>
    </div>
  );
};
