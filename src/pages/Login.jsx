import React from 'react';
import { useSigninCheck } from 'reactfire';
import SignIn from '../components/SignIn';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { status, data: signInCheckResult } = useSigninCheck();
  const navigate = useNavigate();

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  if (signInCheckResult.signedIn) {
    navigate('/');
  }
  return (
    <div>
      <SignIn />
    </div>
  );
}

export default Login;
