import { Button } from 'antd';
import React from 'react';
import { useAuth, useUser } from 'reactfire';

const SignOut = () => {
  const auth = useAuth();
  const { status, data: user } = useUser();
  if (status === 'loading') {
    return <span>loading...</span>;
  }
  return (
    <div>
      {user?.displayName}
      <Button
        style={{ marginLeft: '1rem' }}
        className='sign-out'
        onClick={() => auth.signOut()}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;
