import React from 'react';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { Card, Menu } from 'antd';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import { useSigninCheck } from 'reactfire';
import SignIn from './SignIn';

function AppLayout({ children }) {
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === 'loading') {
    return <span>loading...</span>;
  }
  return (
    <div>
      {!signInCheckResult.signedIn ? (
        <SignIn />
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <div style={{ width: '265px', borderRight: '1px solid #c2c2c2' }}>
            <Menu
              mode='inline'
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <HomeOutlined />,
                  label: <Link to='/'>Records</Link>,
                },
                {
                  key: '2',
                  icon: <PieChartOutlined />,
                  label: <Link to='/insight'>Insight</Link>,
                },
              ]}
            ></Menu>
          </div>
          <div style={{ flex: 1, backgroundColor: '#eee' }}>
            <div
              style={{
                backgroundColor: '#FFF',
                padding: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3>Application Tracker</h3>
              <SignOut />
            </div>
            <Card
              style={{
                margin: '2rem',
                padding: '2rem',
                backgroundColor: '#fff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {children}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
