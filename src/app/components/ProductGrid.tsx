'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import styles from '@/app/styles/components/ProductGrid.module.scss';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  images: string[];
  pdfUrl: string;
  category: string;
  inStock: boolean;
  featured: boolean;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from JSON file
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const productsData = await response.json();

        setProducts(productsData);
        setFilteredProducts(productsData);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(productsData.map((product: Product) => product.category))
        ) as string[];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products when category changes
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <div className={styles.product_grid}>
        <div className={styles.product_grid__container}>
          <h2 className={styles.product_grid__title}>All Products</h2>
          <div className={styles.product_grid__loading}>
            <div className={styles.product_grid__spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.product_grid}>
        <div className={styles.product_grid__container}>
          <h2 className={styles.product_grid__title}>All Products</h2>
          <p className={styles.product_grid__empty_message}>No products found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.product_grid}>
      <div className={styles.product_grid__container}>
        <h2 className={styles.product_grid__title}>All Products</h2>

        {/* Category Filter */}
        <div className={styles.product_grid__filters}>
          <button
            className={`${styles.product_grid__filter_button} ${
              selectedCategory === 'all' ? styles['product_grid__filter_button--active'] : ''
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>

          {categories.map(category => (
            <button
              key={category}
              className={`${styles.product_grid__filter_button} ${
                selectedCategory === category ? styles['product_grid__filter_button--active'] : ''
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <p className={styles.product_grid__empty_message}>No products found in this category.</p>
        ) : (
          <div className={styles.product_grid__grid}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
