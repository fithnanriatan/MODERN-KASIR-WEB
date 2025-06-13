const db = require("../configs/connection");

exports.getProducts = async () => {
  try {
    await db.query("SELECT * FROM products");
    return "Successfully get products";
  } catch (error) {
    return error;
  }
};

exports.createProduct = async (data) => {
  try {
    await db.query("insert into products set ?", [data]);
    return "Successfuly created";
  } catch (error) {
    return "error when inserting product";
  }
};
