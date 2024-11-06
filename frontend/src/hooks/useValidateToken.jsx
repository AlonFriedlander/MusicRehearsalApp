import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useValidateToken = () => {
  const [isValid, setIsValid] = useState(null); // Track token validation status
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/auth/validate-token',
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
        setIsValid(false);
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  return isValid;
};

export default useValidateToken;
