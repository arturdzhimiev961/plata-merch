'use client';

import { formatPrice } from '@/app/lib/utils';
import styles from '@/app/styles/components/ProductCard.module.scss';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // The OrderModal component will handle the click event on elements with the 'order-button' class
  // and set the product value in the form

  const handleDownloadPdf = () => {
    // Open PDF in a new tab
    window.open(product.pdfUrl, '_blank');
  };

  return (
    <div className={styles.product_card}>
      {/* Product Image Slider */}
      <div className={styles.product_card__image_container}>
        {/* Commenting out images to prevent errors */}
        {/*
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="h-full w-full"
        >
          {product.images.map((image, index) => (
            <SwiperSlide key={`${product.id}-image-${index}`}>
              <div className="relative h-full w-full">
                <Image
                  src={imageError[image] ? '/placeholder.jpg' : image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={() => handleImageError(image)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        */}
        <div className={styles.product_card__image_placeholder}>
          <p className={styles.product_card__image_placeholder_text}>{product.name}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className={styles.product_card__info}>
        <h3 className={styles.product_card__title}>{product.name}</h3>
        <p className={styles.product_card__description}>{product.shortDescription}</p>
        <div className={styles.product_card__price}>
          {formatPrice(product.price)}
        </div>

        {/* Action Buttons */}
        <div className={styles.product_card__actions}>
          <button
            className={`btn btn--primary ${styles.product_card__order_button} order-button`}
            disabled={!product.inStock}
            data-product={product.name}
          >
            {product.inStock ? 'Order Now' : 'Out of Stock'}
          </button>
          <button
            className="btn btn--outline"
            onClick={handleDownloadPdf}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.product_card__pdf_button_icon}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
