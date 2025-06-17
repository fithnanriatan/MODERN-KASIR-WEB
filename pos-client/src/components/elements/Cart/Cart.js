import React, { useState } from "react";
import styles from "./index.module.css";
import { useCart, useCartDispatch } from "@/context/CartContext";
import Image from "next/image";
import api from "@/api";
import { useRouter } from "next/router";

const Cart = () => {
  const [payAmount, setPayAmount] = useState("");

  const carts = useCart();
  const dispatch = useCartDispatch();

  const router = useRouter()

  const handleAddToCart = (product) => {
    dispatch({
      type: "add",
      payload: product,
    });
  };

  const handleDecreaseCart = (product) => {
    dispatch({
      type: "decrease",
      payload: product,
    });
  };

  const getTotalPrice = () => {
    let totalPrice = 0;

    for (let i = 0; i < carts.length; i++) {
      totalPrice += carts[i].price * carts[i].quantity;
    }

    return totalPrice;
  };

  const handleChangePay = (event) => {
    const { value } = event.target;
    setPayAmount(value);
  };

  const handleCheckOut = async () => {
    // Validasi cart tidak kosong
    if (carts.length === 0) {
      alert("Cart kosong! Tambahkan produk terlebih dahulu.");
      return;
    }

    // Validasi jumlah bayar
    const totalPrice = getTotalPrice();
    const paidAmount = parseFloat(payAmount);

    if (!payAmount || isNaN(paidAmount) || paidAmount <= 0) {
      alert("Masukkan jumlah pembayaran yang valid!");
      return;
    }

    if (paidAmount < totalPrice) {
      alert(
        `Jumlah bayar kurang! Total: ${totalPrice.toLocaleString(
          "id-ID"
        )}, Bayar: ${paidAmount.toLocaleString("id-ID")}`
      );
      return;
    }

    const products = carts.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    try {
      const payload = {
        total_price: totalPrice,
        paid_amount: paidAmount,
        products,
      };

      // Success handling
      const change = paidAmount - totalPrice;
      alert(
        `Checkout berhasil!\nTotal: ${totalPrice.toLocaleString(
          "id-ID"
        )}\nBayar: ${paidAmount.toLocaleString(
          "id-ID"
        )}\nKembalian: ${change.toLocaleString("id-ID")}`
      );

      setPayAmount("");

      // Redirect ke halaman transactions
      router.push("/transaction");
    } catch (error) {
      console.error("Checkout error:", error);

      // Better error handling
      let errorMessage = "Checkout gagal!";

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className={styles.cart}>
      <h3 className={styles.cartTitle}>Cart</h3>
      <div className={styles.cartList}>
        {carts.length === 0 ? (
          <p className={styles.emptyCart}>Cart kosong</p>
        ) : (
          carts.map((cart, index) => (
            <div key={index} className={styles.cartItem}>
              <div className={styles.cartItemImage}>
                <Image
                  src={cart.img_product}
                  alt={cart.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.cartItemDesc}>
                <p className={styles.productName}>{cart.name}</p>
                <p className={styles.productPrice}>
                  Rp {formatPrice(cart.price)}
                </p>
              </div>
              <div className={styles.cartItemAction}>
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleDecreaseCart(cart)}
                >
                  -
                </button>
                <span className={styles.quantity}>{cart.quantity}</span>
                <button
                  className={styles.quantityBtn}
                  onClick={() => handleAddToCart(cart)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles.cartCheckout}>
        <div className={styles.cartTotalPrice}>
          <p className={styles.totalLabel}>Total Harga</p>
          <p className={styles.totalAmount}>
            Rp {formatPrice(getTotalPrice())}
          </p>
        </div>
        <div className={styles.cartPay}>
          <label htmlFor="payAmount" className={styles.payLabel}>
            Bayar
          </label>
          <input
            id="payAmount"
            type="number"
            placeholder="0"
            value={payAmount}
            onChange={handleChangePay}
            min="0"
            step="1000"
            className={styles.payInput}
          />
        </div>
        <button className={styles.checkoutBtn} onClick={handleCheckOut}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
