import { Button } from 'antd';
import React from 'react';
import { useAuth, useUser } from 'reactfire';

const SignOut = () => {
  const auth = useAuth();
  const { data: user } = useUser();

  return (
    <div>
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
    </div>
  );
};

export default SignOut;
