import React, { useState, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import api from "@/api";
import TransactionList from "@/components/elements/TransactionList/TransactionList";

export default function Transaction() {
  const [transactionsList, setTransactionsList] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      const data = response.data.payload.transactions
      setTransactionsList(data)
    } catch (error) {
      throw Error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  console.log(transactionsList);
  
  return (
    <Layout>
      <TransactionList transactionsList={transactionsList}/>
    </Layout>
  );
}
