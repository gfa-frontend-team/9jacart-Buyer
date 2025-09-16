import React from 'react';

interface CategoriesSidebarProps {
  categories: string[];
  maxItems?: number;
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({ 
  categories, 
  maxItems = 12 
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block border-r border-gray-200 pr-4 lg:pr-6">
        <div className="sticky top-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            Categories
          </h3>
          <ul className="space-y-3">
            {categories.slice(0, maxItems).map((name, idx) => (
              <li 
                key={`${name}-${idx}`} 
                className="text-sm text-gray-700 hover:text-primary hover:bg-gray-50 cursor-pointer flex items-center justify-between p-2 rounded-md transition-colors"
              >
                <span className="font-medium">{name}</span>
                <span className="text-gray-400 group-hover:text-primary">›</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Categories - Horizontal scroll */}
      <div className="lg:hidden mb-4 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(0, 8).map((name, idx) => (
            <button
              key={`mobile-${name}-${idx}`}
              className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesSidebar;