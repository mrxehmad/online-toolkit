import React, { useState, useRef } from 'react';
import { 
  FiPlus,
  FiDownload, 
  FiFileText, 
  FiCalendar, 
  FiUser, 
  FiMail, 
  FiPhone,
  FiDollarSign,
  FiHash,
  FiCreditCard,
  FiTrash2
} from 'react-icons/fi';

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    // From (Business) Details
    fromName: 'Your Business Name',
    fromEmail: 'business@email.com',
    fromPhone: '+1 (555) 123-4567',
    fromAddress: '123 Business St\nCity, State 12345',
    
    // To (Client) Details
    toName: 'Client Name',
    toEmail: 'client@email.com',
    toPhone: '+1 (555) 987-6543',
    toAddress: '456 Client Ave\nCity, State 67890',
    
    // Items
    items: [
      { id: 1, description: 'Web Design Services', quantity: 1, rate: 500.00 }
    ],
    
    // Notes and Terms
    notes: 'Thank you for your business!',
    terms: 'Payment is due within 30 days of invoice date.',
    
    // Tax and Discount
    taxRate: 10,
    discountRate: 0,
    currency: '$'
  });

  const invoiceRef = useRef();

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: 'New Item',
      quantity: 1,
      rate: 0.00
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateInvoiceData = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * invoiceData.discountRate) / 100;
  };

  const calculateTax = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount();
    return (afterDiscount * invoiceData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const exportToPDF = async () => {
    try {
      // Create a new window with the invoice content
      const printWindow = window.open('', '_blank');
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #333;
              line-height: 1.6;
              padding: 20px;
            }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #007AFF; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: 700; color: #007AFF; }
            .invoice-details { text-align: right; }
            .invoice-number { font-size: 20px; font-weight: 600; color: #007AFF; }
            .addresses { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .address-block { width: 45%; }
            .address-title { font-weight: 600; color: #007AFF; margin-bottom: 10px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .items-table th { background: #f8f9fa; font-weight: 600; color: #007AFF; }
            .items-table .text-right { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-row.final { border-top: 2px solid #007AFF; font-weight: 700; font-size: 18px; color: #007AFF; }
            .notes { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            .notes h4 { color: #007AFF; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="logo">INVOICE</div>
              <div class="invoice-details">
                <div class="invoice-number">#${invoiceData.invoiceNumber}</div>
                <div>Date: ${invoiceData.date}</div>
                <div>Due: ${invoiceData.dueDate}</div>
              </div>
            </div>
            
            <div class="addresses">
              <div class="address-block">
                <div class="address-title">From:</div>
                <div><strong>${invoiceData.fromName}</strong></div>
                <div>${invoiceData.fromEmail}</div>
                <div>${invoiceData.fromPhone}</div>
                <div style="white-space: pre-line;">${invoiceData.fromAddress}</div>
              </div>
              <div class="address-block">
                <div class="address-title">To:</div>
                <div><strong>${invoiceData.toName}</strong></div>
                <div>${invoiceData.toEmail}</div>
                <div>${invoiceData.toPhone}</div>
                <div style="white-space: pre-line;">${invoiceData.toAddress}</div>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${invoiceData.currency}${item.rate.toFixed(2)}</td>
                    <td class="text-right">${invoiceData.currency}${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${invoiceData.currency}${calculateSubtotal().toFixed(2)}</span>
              </div>
              ${invoiceData.discountRate > 0 ? `
                <div class="total-row">
                  <span>Discount (${invoiceData.discountRate}%):</span>
                  <span>-${invoiceData.currency}${calculateDiscount().toFixed(2)}</span>
                </div>
              ` : ''}
              ${invoiceData.taxRate > 0 ? `
                <div class="total-row">
                  <span>Tax (${invoiceData.taxRate}%):</span>
                  <span>${invoiceData.currency}${calculateTax().toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="total-row final">
                <span>Total:</span>
                <span>${invoiceData.currency}${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            ${invoiceData.notes || invoiceData.terms ? `
              <div class="notes">
                ${invoiceData.notes ? `
                  <div>
                    <h4>Notes:</h4>
                    <p>${invoiceData.notes}</p>
                  </div>
                ` : ''}
                ${invoiceData.terms ? `
                  <div style="margin-top: 15px;">
                    <h4>Terms & Conditions:</h4>
                    <p>${invoiceData.terms}</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Wait for the content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Information */}
      <div className="sr-only">
        <h1>Professional Invoice Generator - Create & Export PDF Invoices Online Free</h1>
        <p>Generate professional invoices instantly with our free online invoice generator. iOS-styled interface, PDF export, mobile-friendly. Perfect for freelancers, small businesses, and contractors. Create beautiful invoices in seconds with automatic calculations, tax support, and professional templates.</p>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FiFileText className="text-blue-600" />
                Invoice Generator
              </h1>
              <p className="text-gray-600 mt-1">Create professional invoices instantly</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={exportToPDF}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <FiDownload size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Invoice Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiHash className="text-blue-600" />
                Invoice Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FiCalendar size={14} />
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => updateInvoiceData('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* From/To Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* From */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-green-600" />
                  From (Your Business)
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Business Name"
                    value={invoiceData.fromName}
                    onChange={(e) => updateInvoiceData('fromName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="business@email.com"
                      value={invoiceData.fromEmail}
                      onChange={(e) => updateInvoiceData('fromEmail', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={invoiceData.fromPhone}
                      onChange={(e) => updateInvoiceData('fromPhone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Business Address"
                    value={invoiceData.fromAddress}
                    onChange={(e) => updateInvoiceData('fromAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* To */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUser className="text-blue-600" />
                  To (Client)
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={invoiceData.toName}
                    onChange={(e) => updateInvoiceData('toName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="client@email.com"
                      value={invoiceData.toEmail}
                      onChange={(e) => updateInvoiceData('toEmail', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      placeholder="+1 (555) 987-6543"
                      value={invoiceData.toPhone}
                      onChange={(e) => updateInvoiceData('toPhone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Client Address"
                    value={invoiceData.toAddress}
                    onChange={(e) => updateInvoiceData('toAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiCreditCard className="text-purple-600" />
                  Invoice Items
                </h3>
                <button
                  onClick={addItem}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <FiPlus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {invoiceData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        placeholder="Rate"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center">
                      <span className="font-semibold text-gray-900">
                        {invoiceData.currency}{(item.quantity * item.rate).toFixed(2)}
                      </span>
                    </div>
                    <div className="sm:col-span-1 flex items-center">
                      {invoiceData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax & Discount */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-600" />
                Tax & Discount
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceData.taxRate}
                    onChange={(e) => updateInvoiceData('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invoiceData.discountRate}
                    onChange={(e) => updateInvoiceData('discountRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Terms</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    placeholder="Additional notes..."
                    value={invoiceData.notes}
                    onChange={(e) => updateInvoiceData('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    placeholder="Payment terms and conditions..."
                    value={invoiceData.terms}
                    onChange={(e) => updateInvoiceData('terms', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="xl:sticky xl:top-6 xl:h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiFileText className="text-blue-600" />
                Preview
              </h2>

              <div ref={invoiceRef} className="border border-gray-200 rounded-lg p-6 bg-white">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 pb-4 border-b-2 border-blue-600">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h1>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    <div className="text-lg font-semibold text-blue-600">#{invoiceData.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">Date: {invoiceData.date}</div>
                    <div className="text-sm text-gray-600">Due: {invoiceData.dueDate}</div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="font-semibold text-blue-600 mb-2">From:</div>
                    <div className="font-semibold">{invoiceData.fromName}</div>
                    <div className="text-sm text-gray-600">{invoiceData.fromEmail}</div>
                    <div className="text-sm text-gray-600">{invoiceData.fromPhone}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.fromAddress}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-600 mb-2">To:</div>
                    <div className="font-semibold">{invoiceData.toName}</div>
                    <div className="text-sm text-gray-600">{invoiceData.toEmail}</div>
                    <div className="text-sm text-gray-600">{invoiceData.toPhone}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{invoiceData.toAddress}</div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold text-blue-600">Description</th>
                        <th className="text-right p-3 font-semibold text-blue-600 w-16">Qty</th>
                        <th className="text-right p-3 font-semibold text-blue-600 w-20">Rate</th>
                        <th className="text-right p-3 font-semibold text-blue-600 w-24">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">{invoiceData.currency}{item.rate.toFixed(2)}</td>
                          <td className="p-3 text-right">{invoiceData.currency}{(item.quantity * item.rate).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-full sm:w-80">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>{invoiceData.currency}{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {invoiceData.discountRate > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Discount ({invoiceData.discountRate}%):</span>
                        <span>-{invoiceData.currency}{calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    {invoiceData.taxRate > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>{invoiceData.currency}{calculateTax().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-t-2 border-blue-600 font-bold text-lg text-blue-600">
                      <span>Total:</span>
                      <span>{invoiceData.currency}{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(invoiceData.notes || invoiceData.terms) && (
                  <div className="pt-4 border-t border-gray-200">
                    {invoiceData.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-blue-600 mb-2">Notes:</h4>
                        <p className="text-sm text-gray-700">{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">Terms & Conditions:</h4>
                        <p className="text-sm text-gray-700">{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Invoice Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {invoiceData.currency}{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Professional Invoice Generator - Free Online Tool
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
                <p className="text-gray-600">Create stunning, iOS-styled invoices that look professional and modern. Perfect for any business size.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDownload className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant PDF Export</h3>
                <p className="text-gray-600">Generate and download professional PDF invoices instantly. No signup required, completely free to use.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Calculations</h3>
                <p className="text-gray-600">Automatic tax and discount calculations. Support for multiple items with quantity and rate calculations.</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Use Our Invoice Generator?</h3>
              
              <p className="mb-6">
                Our free online invoice generator is designed for freelancers, small businesses, consultants, and contractors who need to create professional invoices quickly and efficiently. With our iOS-inspired design, you get a clean, modern interface that works perfectly on desktop, tablet, and mobile devices.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Professional invoice templates</li>
                    <li>• Instant PDF generation and download</li>
                    <li>• Automatic tax and discount calculations</li>
                    <li>• Mobile-responsive design</li>
                    <li>• No registration or signup required</li>
                    <li>• Completely free to use</li>
                    <li>• Works offline in your browser</li>
                    <li>• Privacy-focused - no data stored on servers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Perfect For:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Freelancers and consultants</li>
                    <li>• Small business owners</li>
                    <li>• Service providers</li>
                    <li>• Contractors and agencies</li>
                    <li>• Online sellers</li>
                    <li>• Digital marketers</li>
                    <li>• Creative professionals</li>
                    <li>• Anyone needing professional invoices</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                  <p className="font-semibold text-gray-900 mb-2">Fill Details</p>
                  <p className="text-sm text-gray-600">Enter your business and client information</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                  <p className="font-semibold text-gray-900 mb-2">Add Items</p>
                  <p className="text-sm text-gray-600">List your services or products with pricing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                  <p className="font-semibold text-gray-900 mb-2">Set Terms</p>
                  <p className="text-sm text-gray-600">Configure taxes, discounts, and payment terms</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">4</div>
                  <p className="font-semibold text-gray-900 mb-2">Export PDF</p>
                  <p className="text-sm text-gray-600">Download your professional invoice instantly</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Is this invoice generator completely free?</h4>
                  <p className="text-gray-700">Yes! Our invoice generator is 100% free to use. You can create unlimited invoices and export them as PDFs without any cost or registration.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need to create an account to use this?</h4>
                  <p className="text-gray-700">No registration required! You can start creating professional invoices immediately without providing any personal information.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibent text-gray-900 mb-2">Is my data secure?</h4>
                  <p className="text-gray-700">Absolutely! All processing happens in your browser. We don't store any of your invoice data on our servers, ensuring complete privacy and security.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Can I use this on my mobile device?</h4>
                  <p className="text-gray-700">Yes! Our invoice generator is fully responsive and works perfectly on smartphones, tablets, and desktop computers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;