import React from 'react';
import {
  TableOutlined,
  MenuOutlined,
  HomeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import SignOut from '../SignOut/SignOut';
import { useSigninCheck } from 'reactfire';
import SignIn from '../SignIn/SignIn';
const { SubMenu } = Menu;

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
              defaultOpenKeys={['sub1']}
            >
              <SubMenu key='sub1' icon={<MenuOutlined />} title='Links'>
                <Menu.Item key='1' icon={<HomeOutlined />}>
                  <Link to='/'>Home</Link>
                </Menu.Item>
                <Menu.Item key='2' icon={<TableOutlined />}>
                  <Link to='/applications'>Records</Link>
                </Menu.Item>
                <Menu.Item key='3' icon={<PlusOutlined />}>
                  <Link to='/add-application'>Application</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div style={{ flex: 1, backgroundColor: '#eee' }}>
            <div
              style={{
                backgroundColor: 'lightblue',
                padding: '10px',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <SignOut />
            </div>
            <div
              style={{
                margin: '2rem',
                padding: '2rem',
                backgroundColor: '#fff',
              }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
