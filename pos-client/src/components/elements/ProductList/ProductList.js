import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
import { useCartDispatch } from "@/context/CartContext";

const ProductList = ({ products }) => {
  const dispatch = useCartDispatch();

  const handleAddToCart = (product) => {
    dispatch({
      type: "add",
      payload: product,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className={styles.productList}>
      {products.map((product, index) => {
        return (
          <div key={index} className={styles.productCard}>
            <div className={styles.productImage}>
              <Image
                src={product.img_product}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                style={{ objectFit: "contain" }}
              />
              {product.badge && (
                <div className={styles.productBadge}>
                  <span className={styles.badgeText}>{product.badge}</span>
                </div>
              )}
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              {product.price && (
                <p className={styles.productPrice}>Rp {formatPrice(product.price)}</p>
              )}
              <div className={styles.productActions}>
                <button 
                  className={styles.addToCartBtn}
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;