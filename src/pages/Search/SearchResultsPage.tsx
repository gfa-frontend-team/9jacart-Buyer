import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <p className="text-gray-600 mb-8">Results for: "{query}"</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="text-gray-500">Search results will be displayed here</div>
      </div>
    </div>
  );
};

export default SearchResultsPage;