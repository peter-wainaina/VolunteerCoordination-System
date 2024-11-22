import React from 'react';

const ChartComponent = ({ data }) => {
  return (
    <div className="h-70">
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        {data ? (
          <p className="text-gray-500">Chart Data: {JSON.stringify(data)}</p>
        ) : (
          <p className="text-gray-500">Graph Placeholder</p>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
