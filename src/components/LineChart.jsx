import React from 'react';
import { Chart } from 'react-google-charts';

const getDisplayData = (data) => {
  const formattedData = data.reduce(
    (acc, item) => {
      const existing = acc.find(([date]) => date === item.date);

      if (existing) {
        existing[1]++;
      } else {
        acc.push([item.date, 1]);
      }

      return acc;
    },
    [['Date', 'Applications']]
  );
  return formattedData.sort((a, b) => new Date(a[0]) - new Date(b[0]));
};

const LineChart = ({ data }) => {
  const displayData = getDisplayData(data);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Chart
        width={'600px'}
        height={'300px'}
        chartType='LineChart'
        loader={<div>Loading Chart</div>}
        data={displayData}
        options={{
          title: 'Applications Over Time',
          titleTextStyle: {
            fontSize: 20,
          },
          hAxis: {
            title: 'Date',
          },
          vAxis: {
            title: 'Applications',
          },
        }}
      />
    </div>
  );
};

export default LineChart;
