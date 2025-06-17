import React, { useState } from "react";
import styles from "./index.module.css";

export default function TransactionList({ transactionsList }) {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const formatDate = (dateString) => {
    // Jika ada timestamp dari database, gunakan ini
    // return new Date(dateString).toLocaleDateString('id-ID');
    return new Date().toLocaleDateString("id-ID"); // Sementara menggunakan tanggal hari ini
  };

  const toggleExpand = (index) => {
    setExpandedTransaction(expandedTransaction === index ? null : index);
  };

  const getChange = (paidAmount, totalPrice) => {
    return paidAmount - totalPrice;
  };

  if (transactionsList.length === 0) {
    return (
      <div>
        <p>Belum ada transaksi</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionList}>
      <div className={styles.header}>
        <h2>Riwayat Transaksi</h2>
        <p>Total {transactionsList.length} transaksi</p>
      </div>

      <div className={styles.listContainer}>
        {transactionsList.map((transaction, index) => {
          const isExpanded = expandedTransaction === index;
          const change = getChange(
            transaction.paid_amount,
            transaction.total_price
          );

          return (
            <div key={index} className={styles.transactionCard}>
              {/* Header Transaksi */}
              <div
                className={styles.transactionHeader}
                onClick={() => toggleExpand(index)}
              >
                <div className={styles.orderInfo}>
                  <div className={styles.orderNumber}>
                    <span className={styles.label}>No. Order</span>
                    <span className={styles.value}>{transaction.no_order}</span>
                  </div>
                  <div className={styles.date}>
                    <span className={styles.dateText}>{formatDate()}</span>
                  </div>
                </div>

                <div className={styles.priceInfo}>
                  <div className={styles.totalPrice}>
                    <span className={styles.priceLabel}>Total</span>
                    <span className={styles.priceValue}>
                      Rp {formatPrice(transaction.total_price)}
                    </span>
                  </div>
                  <div className={styles.expandIcon}>
                    <span className={isExpanded ? styles.expanded : ""}>▼</span>
                  </div>
                </div>
              </div>

              {/* Detail Transaksi */}
              {isExpanded && (
                <div className={styles.transactionDetails}>
                  {/* Payment Info */}
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentRow}>
                      <span>Total Harga:</span>
                      <span>Rp {formatPrice(transaction.total_price)}</span>
                    </div>
                    <div className={styles.paymentRow}>
                      <span>Jumlah Bayar:</span>
                      <span>Rp {formatPrice(transaction.paid_amount)}</span>
                    </div>
                    <div className={`${styles.paymentRow} ${styles.change}`}>
                      <span>Kembalian:</span>
                      <span>Rp {formatPrice(change)}</span>
                    </div>
                  </div>

                  {/* Products List */}
                  <div className={styles.productsSection}>
                    <h4>Produk ({transaction.products.length} item)</h4>
                    <div className={styles.productsList}>
                      {transaction.products.map((product, productIndex) => (
                        <div key={productIndex} className={styles.productItem}>
                          <div className={styles.productInfo}>
                            <span className={styles.productName}>
                              {product.product ||
                                `Product ID: ${product.id_product}`}
                            </span>
                            <span className={styles.productQuantity}>
                              x{product.quantity}
                            </span>
                          </div>
                          {/* Uncomment jika ada data harga per item
                          <div className={styles.productPrice}>
                            Rp {formatPrice(product.price * product.quantity)}
                          </div>
                          */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
