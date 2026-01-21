import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const AuthLogin: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      const username = sessionStorage.getItem('authenticateUsername');
      const password = sessionStorage.getItem('authenticatePassword');
      if (!username || !password) {
        setError('Missing username or password in session storage.');
        return;
      }
      const { data, error: queryError } = await supabase
        .from('user_table')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (queryError) {
        setError('Authentication failed: ' + queryError.message);
        window.location.href = '/login';
      } else if (data) {
        setError(null);
        alert('User authenticated successfully! Welcome, ' + data.username);
        sessionStorage.removeItem('authenticateUsername');
        sessionStorage.removeItem('authenticatePassword');
        sessionStorage.setItem('currentUserId', data.user_id.toString());
        window.location.href = '/profile';
      }
    };
    authenticateUser(
    );
  }, []);
  return (
    <div className="AuthLogin">
      <h1>Authenticating...</h1>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default AuthLogin