'use client';

import Header from "./components/Header";
import ProductSlider from "./components/ProductSlider";
import ProductGrid from "./components/ProductGrid";
import OrderModal from "./components/modals/OrderModal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ProductSlider />
        <ProductGrid />
      </main>
      <OrderModal />
    </>
  );
}
