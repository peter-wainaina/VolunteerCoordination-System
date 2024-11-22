import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const LineChartComponent = React.memo(({ 
  data, 
  xKey = 'name', 
  lineDataKeys = ['value'], 
  colors = ['#8884d8', '#82ca9d', '#ffc658'] 
}) => {
  // Validate data
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ 
            top: 5, 
            right: 30, 
            left: 20, 
            bottom: 5 
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f5f5f5" 
          />
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: '#666' }} 
          />
          <YAxis 
            tick={{ fill: '#666' }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #ddd' 
            }} 
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
          />
          
          {lineDataKeys.map((dataKey, index) => (
            <Line
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
              name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChartComponent.displayName = 'LineChartComponent';

export default LineChartComponent;