import { useState, useEffect, useMemo } from 'react';
import { mockApi, mockProducts } from '../data/mockData';
import type { Product, ProductSummary } from '../types';

export const useProductList = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          ...(selectedCategory && { category: selectedCategory }),
          ...(searchQuery && { search: searchQuery })
        };
        
        const productData = await mockApi.getProducts(filters);
        
        // Convert to ProductSummary format
        const summaries: ProductSummary[] = productData.map(product => ({
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          categoryId: product.categoryId,
          price: product.price,
          inventory: {
            inStock: product.inventory.inStock,
            status: product.inventory.status
          },
          images: {
            main: product.images.main,
            alt: product.images.alt
          },
          reviews: {
            average: product.reviews.average,
            total: product.reviews.total
          },
          flags: product.flags
        }));
        
        setProducts(summaries);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery, selectedCategory]);

  const totalCount = products.length;

  return {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    totalCount
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await mockApi.getProduct(id);
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error
  };
};

export const useRelatedProducts = (categoryId: string, excludeId: string, limit: number = 4) => {
  const relatedProducts = useMemo(() => {
    return mockProducts
      .filter(product => 
        product.categoryId === categoryId && 
        product.id !== excludeId &&
        product.status === 'active'
      )
      .slice(0, limit);
  }, [categoryId, excludeId, limit]);

  return relatedProducts;
};