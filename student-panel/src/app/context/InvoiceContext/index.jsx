'use client';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const InvoiceContext = createContext(undefined);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const invoiceLists = [
        //   {
        //     id: 101,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xaz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Pending',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 102,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },

        //   {
        //     id: 103,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Succeed',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 104,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },

        //   {
        //     id: 105,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Succeed',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 106,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },

        //   {
        //     id: 108,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Succeed',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 109,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },

        //   {
        //     id: 110,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Succeed',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 111,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },

        //   {
        //     id: 112,
        //     Subscription: 'Pro',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'Redq Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-01-01', // Example start date
        //     endDate: '2023-01-31', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Succeed',
        //     completed: false,
        //     isSelected: false,
        //   },
        //   {
        //     id: 113,
        //     Subscription: 'Starter',
        //     billFromEmail: 'first@xabz.com',
        //     billFromAddress: 'Ganesh glory, Godrej garden city, Ahmedabad.',
        //     billFromPhone: 979796786,
        //     billFromFax: 13,
        //     billTo: 'ME Inc.',
        //     billToEmail: 'toFirst@agth.com',
        //     billToAddress: 'Godrej garden city, Ahmedabad.',
        //     billToPhone: 757575233,
        //     billToFax: 76,
        //     orders: [
        //       {
        //         itemName: 'Courge',
        //         unitPrice: 10,
        //         units: 9,
        //         unitTotalPrice: 90,
        //       },
        //     ],
        //     orderDate: new Date(),
        //     startDate: '2023-02-01', // Example start date
        //     endDate: '2023-02-28', // Example end date
        //     totalCost: 90,
        //     vat: 9,
        //     grandTotal: 99,
        //     status: 'Canceled',
        //     completed: false,
        //     isSelected: false,
        //   },
        // ];
        const fetchPaymentHistory = await axios.get('/payment/payment-history');
        console.log(fetchPaymentHistory.data.paymentHistory);
        setInvoices(fetchPaymentHistory.data.paymentHistory);
        setLoading(false);
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to delete an invoice
  const deleteInvoice = async (id) => {
    try {
      await axios.delete('/api/data/invoicedata/deleteinvoice', { data: { invoiceId: id } });
      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  //  Function to update an invoice
  const updateInvoice = async (updatedInvoice) => {
    try {
      const response = await axios.put('/api/data/invoicedata/updateinvoice', updatedInvoice);
      const updated = response.data;
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) => (invoice.id === updated.id ? updated : invoice)),
      );
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  return (
    <InvoiceContext.Provider value={{ invoices, loading, error, deleteInvoice, updateInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};
