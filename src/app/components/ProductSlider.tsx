'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import styles from '@/app/styles/components/ProductSlider.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

export default function ProductSlider() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from JSON file
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const products = await response.json();

        // Filter featured products
        const featured = products.filter((product: Product) => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.product_slider}>
        <div className={styles.product_slider__container}>
          <h2 className={styles.product_slider__title}>Featured Products</h2>
          <div className={styles.product_slider__loading}>
            <div className={styles.product_slider__spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className={styles.product_slider}>
      <div className={styles.product_slider__container}>
        <h2 className={styles.product_slider__title}>Featured Products</h2>

        <div className={styles.swiper_wrapper}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              // When window width is >= 640px
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              // When window width is >= 768px
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              // When window width is >= 1024px
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="product-slider"
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className={styles.product_slider__slide}>
                  <ProductCard
                    product={product}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
