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

  return (
    <div className={styles["product-list"]}>
      {products.map((product, index) => {
        return (
          <div key={index} className={styles["product-list__product-card"]}>
            <div className={styles["product-list__product-card__image"]}>
              <Image
                src={product.img_product}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles["product-list__product-card__desc"]}>
              <p>{product.name}</p>
              <button onClick={() => handleAddToCart(product)}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
