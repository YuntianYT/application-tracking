import React from 'react';
import { useAuth, useUser } from 'reactfire';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import GoogleButton from 'react-google-button';

const SignIn = () => {
  const auth = useAuth();
  const { status } = useUser();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (status === 'loading') {
    return <span>loading...</span>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10rem',
      }}
    >
      <h1>Application Tracking System</h1>
      <GoogleButton onClick={signInWithGoogle} />
    </div>
  );
};

export default SignIn;
