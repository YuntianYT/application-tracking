import React from 'react';
import ApplicationForm from '../components/ApplicationForm';
import { Divider } from 'antd';
import ApplicationTable from '../components/ApplicationTable';

function Home() {
  return (
    <>
      <ApplicationForm />
      <Divider />
      <ApplicationTable />
    </>
  );
}

export default Home;
