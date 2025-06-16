const db = require("../configs/database");

exports.fetchTransaction = async () => {
	const query = await db.query("SELECT * FROM transactions AS t INNER JOIN transaction_detail AS i ON t.no_order = i.no_order LEFT JOIN products AS p ON i.id_product = p.id")

	if (!query.error) {
		let listTransactions = [], listDetail = [], lastPush = "";
		
		for (let index in query) {
			if (lastPush !== query[index].no_order) {
                for (let i in query) {
                    if (query[i].no_order === query[index].no_order) {
                        listDetail.push({
                            no_order: query[i].no_order,
                            product: query[i].name,
                            quantity: query[i].quantity,
                        });
                    }
                }
				listTransactions.push({
                    no_order: query[index].no_order,
					total_price: query[index].total_price,
					paid_amount: query[index].paid_amount,
					products: listDetail,
				});
                listDetail = []
				lastPush = query[index].no_order;
			}
		}
        return { transactions : listTransactions }
	}
};

exports.addTransaction = async (order, products) => {
	const query = await db.query("INSERT INTO transactions SET ?", [order])
	
	if (!query.error) {
		const transaction_detail = [];
		const product_id = [];
		
		products.map((product) => {
			transaction_detail.push([order.no_order, product.id, product.quantity]);
			product_id.push([product.id]);
		});

		const updateDetailStock = await addDetailTransaction(
			transaction_detail,
			product_id
		);

		if (!updateDetailStock.error) {
			return db.query(
				"SELECT * FROM transactions WHERE no_order = ?",
				order.no_order
			);
		}
		return updateDetailStock;
	}
};


// 👇 internal function 👇

async function addDetailTransaction(transaction_detail, product_id) {
	const query = await db.query("INSERT INTO transaction_detail(no_order,id_product,quantity) VALUES ?", [transaction_detail])

	if (!query.error) {
		return updateStock(transaction_detail, product_id);
	}
};


async function updateStock(transaction_detail, product_id) {
    try {
        const query = await db.query("SELECT id, stock FROM products WHERE id IN (?)", [product_id]);

        if (!query.error && query.length === product_id.length) {
            // Update stock untuk setiap produk
            const updatePromises = transaction_detail.map(async (detail, index) => {
                const productId = detail[1];
                const quantitySold = detail[2];
                const currentStock = query[index].stock;
                const newStock = currentStock - quantitySold;

                // Validasi stock mencukupi
                if (newStock < 0) {
                    throw new Error(`Insufficient stock for product ID ${productId}. Available: ${currentStock}, Required: ${quantitySold}`);
                }

                return db.query("UPDATE products SET stock = ? WHERE id = ?", [newStock, productId]);
            });

            await Promise.all(updatePromises);
            return { success: true, message: "Stock updated successfully" };
        }
        
        return { error: "Product data mismatch" };
    } catch (error) {
        console.error('Error updating stock:', error);
        return { error: error.message };
    }
}