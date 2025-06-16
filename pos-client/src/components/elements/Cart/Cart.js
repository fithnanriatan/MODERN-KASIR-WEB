import React, { useState } from "react";
import styles from "./index.module.css";
import { useCart, useCartDispatch } from "@/context/CartContext";
import Image from "next/image";
import api from "@/api";

const Cart = () => {
  const [payAmount, setPayAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const carts = useCart();
  const dispatch = useCartDispatch();

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
      alert('Cart kosong! Tambahkan produk terlebih dahulu.');
      return;
    }

    // Validasi jumlah bayar
    const totalPrice = getTotalPrice();
    const paidAmount = parseFloat(payAmount);
    
    if (!payAmount || isNaN(paidAmount) || paidAmount <= 0) {
      alert('Masukkan jumlah pembayaran yang valid!');
      return;
    }

    if (paidAmount < totalPrice) {
      alert(`Jumlah bayar kurang! Total: ${totalPrice.toLocaleString('id-ID')}, Bayar: ${paidAmount.toLocaleString('id-ID')}`);
      return;
    }

    const products = carts.map((item) => ({
      id: item.id,
      quantity: item.quantity
    }));
    
    setIsLoading(true);
    
    try {
      const payload = {
        total_price: totalPrice,
        paid_amount: paidAmount,
        products
      };

      const response = await api.post('/transactions', payload);
      console.log('Transaction successful:', response);
      
      // Success handling
      const change = paidAmount - totalPrice;
      alert(`Checkout berhasil!\nTotal: ${totalPrice.toLocaleString('id-ID')}\nBayar: ${paidAmount.toLocaleString('id-ID')}\nKembalian: ${change.toLocaleString('id-ID')}`);
      
      // Reset form dan cart
      setPayAmount("");
      // Optionally clear cart
      // dispatch({ type: "clear" });
      
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Better error handling
      let errorMessage = 'Checkout gagal!';
      
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className={styles.cart}>
      <h3>Cart</h3>
      <div className={styles["cart__cart-list"]}>
        {carts.length === 0 ? (
          <p>Cart kosong</p>
        ) : (
          carts.map((cart, index) => (
            <div key={index} className={styles["cart-item"]}>
              <div className={styles["cart-item__image"]}>
                <Image
                  src={cart.img_product}
                  alt={cart.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles["cart-item__desc"]}>
                <p>{cart.name}</p>
                <p>Rp {formatPrice(cart.price)}</p>
              </div>
              <div className={styles["cart-item__action"]}>
                <button onClick={() => handleDecreaseCart(cart)}>-</button>
                <p>{cart.quantity}</p>
                <button onClick={() => handleAddToCart(cart)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className={styles["cart__checkout"]}>
        <div className={styles["cart__total-price"]}>
          <p>Total Harga</p>
          <p>Rp {formatPrice(getTotalPrice())}</p>
        </div>
        <div className={styles["cart__pay"]}>
          <label htmlFor="payAmount">Bayar</label>
          <input
            id="payAmount"
            type="number"
            placeholder="0"
            value={payAmount}
            onChange={handleChangePay}
            min="0"
            step="1000"
          />
        </div>
        <button 
          onClick={handleCheckOut}
          disabled={isLoading || carts.length === 0}
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;