
import React, { useState } from 'react';
import './styles.css';

const SearchAndFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm, category);
  };

  return (
    <div className="search-filter-container">
      <input
        type="text"
        placeholder="Search opportunities"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="health">Health</option>
        <option value="education">Education</option>
        {/* Add more categories as needed */}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchAndFilter;
