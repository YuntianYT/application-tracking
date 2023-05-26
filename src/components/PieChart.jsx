import React from 'react';
import { Chart } from 'react-google-charts';

const getStatusCounts = (data) => {
  const counts = {};
  data.forEach((item) => {
    const { status } = item;
    if (counts[status]) {
      counts[status] += 1;
    } else {
      counts[status] = 1;
    }
  });
  return Object.entries(counts);
};

const PieChart = ({ data }) => {
  const statusCounts = getStatusCounts(data);

  return (
    <Chart
      width={'500px'}
      height={'300px'}
      chartType='PieChart'
      loader={<div>Loading Chart</div>}
      data={[['Status', 'Count'], ...statusCounts]}
      options={{
        title: 'Application Status',
      }}
    />
  );
};

export default PieChart;
