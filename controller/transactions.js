const db = require("../configs/connection");

exports.checkout = async (data, products) => {
  try {
    // input Transactions
    await db.query("INSERT INTO transactions SET ?", [data]);
    let dataProducts = products.map((item) => [
      item.id,
      data.no_order,
      item.quantity,
    ]);

    // input detail transaksi
    await db.query(
      "INSERT INTO transaction_detail (id_product, no_order, quantity) VALUES ?",
      [dataProducts]
    );

    // UPDATE STOCK
    // Ambil semua stok produk yang dibeli
    const ids = products.map((item) => item.id);
    const stockRows = await db.query(
      "SELECT id, stock FROM products WHERE id IN (?)",
      [ids]
    );

    // Perbarui stok satu per satu
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const current = stockRows.find((p) => p.id === item.id);

      // Hitung stok baru
      const newStock = current.stock - item.quantity;

      // Update ke database
      await db.query("UPDATE products SET stock = ? WHERE id = ?", [
        newStock,
        item.id,
      ]);

      // Tampilkan log untuk tiap produk yang berhasil di-update
      console.log(
        `Produk dengan ID ${item.id} telah dikurangi stoknya sebanyak ${item.quantity}. Stok baru: ${newStock}`
      );
    }

    // Tampilkan log utama setelah semua berhasil
    console.log("🟢 Semua stok berhasil diperbarui!");

    const dataOrder = await db.query(
      "SELECT * FROM transactions WHERE no_order = ?",
      [data.no_order]
    );

    return dataOrder[0]; // Kembalikan data transaksi yang baru
  } catch (error) {
    return error;
  }
};
