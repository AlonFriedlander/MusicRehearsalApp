import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const useValidateToken = (isAdmin=false) => {
  const [isValid, setIsValid] = useState(null); // Track token validation status
  const navigate = useNavigate();

  const validateEndpoint = isAdmin ? '/api/auth/validate-admin-token' : '/api/auth/validate-token';

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}${validateEndpoint}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error("You don't have permission to access this page", {position: 'bottom-left'});
        setIsValid(false);
        navigate('/login');
      }
    };

    validateToken();
  }, []); // Empty dependency array ensures useEffect runs only once

  return isValid;
};

export default useValidateToken;
