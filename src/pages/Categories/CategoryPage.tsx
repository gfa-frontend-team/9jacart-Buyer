import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category} Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="text-gray-500">Products in {category} category will be displayed here</div>
      </div>
    </div>
  );
};

export default CategoryPage;