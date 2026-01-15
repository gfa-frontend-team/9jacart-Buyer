import type { Category } from '../types';
import type { ApiCategoryData } from '../api/categories';

// Helper function to generate slug from category name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to get default category image based on name
const getDefaultCategoryImage = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  
  // Map category names to appropriate stock images
  const imageMap: Record<string, string> = {
    'toys': 'https://images.unsplash.com/photo-1558877385-8c1b8e6e8e8e?w=300&h=200&fit=crop',
    'games': 'https://images.unsplash.com/photo-1558877385-8c1b8e6e8e8e?w=300&h=200&fit=crop',
    'home': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
    'gadgets': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
    'men': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    'wear': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
  };
  
  // Find matching image based on category name keywords
  for (const [keyword, image] of Object.entries(imageMap)) {
    if (name.includes(keyword)) {
      return image;
    }
  }
  
  // Default fallback image
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop';
};

// Map API category data to internal Category type
export const mapApiCategoryToCategory = (apiCategory: ApiCategoryData): Category => {
  return {
    id: apiCategory.categoryId,
    name: apiCategory.categoryName,
    slug: generateSlug(apiCategory.categoryName),
    level: 1, // All API categories are treated as level 1 (main categories)
    parentId: undefined, // API doesn't provide hierarchy
    imageUrl: getDefaultCategoryImage(apiCategory.categoryName),
    createdAt: new Date(apiCategory.createdAt),
    updatedAt: new Date(apiCategory.updatedAt),
  };
};

// Map array of API categories to Category array
export const mapApiCategoriesToCategories = (apiCategories: ApiCategoryData[]): Category[] => {
  return apiCategories.map(mapApiCategoryToCategory);
};

// Create services category and subcategories (static data to preserve existing functionality)
// NOTE: Services category is currently archived - set archived: false to restore it
export const createServicesCategories = (): Category[] => {
  const now = new Date();
  
  return [
    // Main services category (ARCHIVED)
    {
      id: "services",
      name: "Services",
      slug: "services",
      level: 1,
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      createdAt: now,
      updatedAt: now,
      archived: true, // Archived - not displayed but not deleted
    },
    // Services subcategories (ARCHIVED)
    {
      id: "mobile-topup",
      name: "Mobile Top Up",
      slug: "mobile-topup",
      parentId: "services",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=300&h=200&fit=crop",
      createdAt: now,
      updatedAt: now,
      archived: true, // Archived - not displayed but not deleted
    },
    {
      id: "bills",
      name: "Bills",
      slug: "bills",
      parentId: "services",
      level: 2,
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
      createdAt: now,
      updatedAt: now,
      archived: true, // Archived - not displayed but not deleted
    },
  ];
};

// Combine API categories with services categories
export const combineWithServicesCategories = (apiCategories: Category[]): Category[] => {
  const servicesCategories = createServicesCategories();
  return [...apiCategories, ...servicesCategories];
};