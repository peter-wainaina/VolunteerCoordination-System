import React from 'react';
import { Card } from './Cardss';

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
};

const StatCard = ({ title, value, icon, change }) => {
  const getChangeDisplay = () => {
    if (change === undefined || change === null) return null;
    
    const absChange = Math.abs(change);
    const changeText = change > 0 ? 'Increase' : change < 0 ? 'Decrease' : 'No change';
    const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className="flex items-center mt-2 space-x-2">
        <span className={`text-sm font-medium ${changeColor}`}>
          {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {formatNumber(absChange)}
          {typeof change === 'number' && change !== 0 ? '%' : ''}
        </span>
        <span className="text-sm text-gray-500">{changeText} vs last month</span>
      </div>
    );
  };

  return (
    <Card className="stats-card animate-fade-in p-4 square-shape">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{formatNumber(value)}</h3>
          {getChangeDisplay()}
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          {React.cloneElement(icon, { className: 'w-6 h-6 text-primary-500' })}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;