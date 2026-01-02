import React, { useState, useRef } from 'react';
import { 
  FiCalendar, 
  FiPlus, FiPrinter, FiSave, FiUpload,
  FiDownload, FiImage,
  FiEdit2, FiCopy, FiCheck
} from 'react-icons/fi';
import { FaRupeeSign, FaRegBuilding, FaRegUser } from 'react-icons/fa';
import { BsReceipt } from 'react-icons/bs';
import Footer from '../components/Footer';
import Header from '../components/Header';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceGenerator = () => {
  // State for invoice data
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    status: 'Pending',
    items: [
      { 
        id: 1, 
        description: 'Web Development Services', 
        quantity: 1, 
        price: 50000, 
        tax: 18,
        hsnCode: '998314'
      }
    ],
    notes: 'Thank you for your business. Please make payment within 30 days.',
    terms: '1. Payment due within 30 days\n2. Late payment interest: 1.5% per month\n3. All disputes subject to Mumbai jurisdiction',
    currency: 'INR',
    discount: 0,
    discountType: 'percentage' // 'percentage' or 'fixed'
  });

  // State for company and client info
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Tech Solutions Pvt. Ltd.',
    address: '123 Business Tower, Andheri East\nMumbai, Maharashtra 400069',
    email: 'accounts@techsolutions.com',
    phone: '+91 98765 43210',
    website: 'www.techsolutions.com',
    gstin: '27AABCT1234M1Z5',
    pan: 'AABCT1234M',
    bankName: 'State Bank of India',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    branch: 'Andheri East'
  });

  const [clientInfo, setClientInfo] = useState({
    name: 'ABC Enterprises',
    address: '456 Corporate Park, Bandra West\nMumbai, Maharashtra 400050',
    email: 'accounts@abcenterprises.com',
    phone: '+91 98765 12345',
    gstin: '27ABCDE5678F1Z2',
    pan: 'ABCDE5678F'
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef();
  const signatureInputRef = useRef();

  // Predefined invoice templates
  const invoiceTemplates = [
    { id: 1, name: 'Professional', bgColor: 'bg-white', textColor: 'text-gray-800' },
    { id: 2, name: 'Modern', bgColor: 'bg-gradient-to-br from-blue-50 to-white', textColor: 'text-gray-800' },
    { id: 3, name: 'Classic', bgColor: 'bg-gradient-to-br from-gray-50 to-white', textColor: 'text-gray-800' },
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(1);

  // Add new item
  const addItem = () => {
    const newItem = {
      id: invoice.items.length + 1,
      description: '',
      quantity: 1,
      price: 0,
      tax: 18,
      hsnCode: ''
    };
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem]
    });
  };

  

  // Update item
  const updateItem = (id, field, value) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedValue = field === 'description' || field === 'hsnCode' 
          ? value 
          : parseFloat(value) || 0;
        return { ...item, [field]: updatedValue };
      }
      return item;
    });
    setInvoice({ ...invoice, items: updatedItems });
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
  };

  const calculateTax = () => {
    return invoice.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * (item.tax / 100));
    }, 0);
  };

  const calculateDiscount = () => {
    if (invoice.discountType === 'percentage') {
      return calculateSubtotal() * (invoice.discount / 100);
    } else {
      return parseFloat(invoice.discount) || 0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // 1MB limit
        alert('File size should be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newNumber = `INV-${year}${month}-${random}`;
    setInvoice({ ...invoice, invoiceNumber: newNumber });
  };

  // Copy to clipboard
  const copyInvoiceData = () => {
    const invoiceData = {
      invoice,
      companyInfo,
      clientInfo,
      totals: {
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: calculateDiscount(),
        total: calculateTotal()
      }
    };
    navigator.clipboard.writeText(JSON.stringify(invoiceData, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const invoiceData = {
        invoice,
        companyInfo,
        clientInfo,
        companyLogo,
        signature,
        totals: {
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          discount: calculateDiscount(),
          total: calculateTotal()
        },
        generatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('lastInvoice', JSON.stringify(invoiceData));
      
      // You can also save to your backend here
      console.log('Invoice saved:', invoiceData);
      
      setTimeout(() => {
        setIsSaving(false);
        alert('✅ Invoice saved successfully!');
      }, 1000);
      
    } catch (error) {
      setIsSaving(false);
      alert('Error saving invoice');
    }
  };

  // Export to PDF with professional template and multi-page support
  const exportToPDF = async () => {
    try {
      // Create a temporary container for PDF generation
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.fontFamily = "'Helvetica', 'Arial', sans-serif";
      pdfContainer.style.color = '#1f2937';
      
      // Create professional invoice template
      pdfContainer.innerHTML = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
        </style>
        
        <div style="font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #1f2937;">
          <!-- Header Section -->
          <div style="border-bottom: 3px solid #1e40af; padding-bottom: 25px; margin-bottom: 35px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                ${companyLogo ? 
                  `<img src="${companyLogo}" style="height: 70px; margin-bottom: 18px; max-width: 200px;" alt="Company Logo">` : 
                  `<div style="font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 18px; letter-spacing: -0.5px;">${companyInfo.name}</div>`
                }
                <div style="color: #4b5563; line-height: 1.8; white-space: pre-line; font-size: 13px;">${companyInfo.address}</div>
                <div style="margin-top: 12px; color: #6b7280; font-size: 12px;">
                  ${companyInfo.email ? `<div style="margin-bottom: 4px;">📧 ${companyInfo.email}</div>` : ''}
                  ${companyInfo.phone ? `<div style="margin-bottom: 4px;">📞 ${companyInfo.phone}</div>` : ''}
                  ${companyInfo.website ? `<div>🌐 ${companyInfo.website}</div>` : ''}
                </div>
              </div>
              
              <div style="text-align: right;">
                <div style="font-size: 42px; font-weight: bold; color: #1e40af; margin-bottom: 12px; letter-spacing: 2px;">INVOICE</div>
                <div style="font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 15px;">${invoice.invoiceNumber}</div>
                <div style="margin-top: 15px; padding: 8px 18px; background: ${invoice.status === 'Paid' ? '#10b981' : invoice.status === 'Overdue' ? '#ef4444' : '#f59e0b'}; color: white; display: inline-block; border-radius: 5px; font-weight: bold; font-size: 13px;">
                  ${invoice.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Client and Invoice Details -->
          <div style="display: flex; gap: 30px; margin-bottom: 35px;">
            <!-- Bill To -->
            <div style="flex: 1; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-weight: bold; color: #374151; margin-bottom: 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">BILL TO</div>
              <div style="font-weight: bold; color: #1e40af; font-size: 19px; margin-bottom: 12px;">${clientInfo.name}</div>
              <div style="color: #4b5563; line-height: 1.8; white-space: pre-line; margin-bottom: 12px; font-size: 13px;">${clientInfo.address}</div>
              <div style="color: #6b7280; font-size: 12px;">
                ${clientInfo.email ? `<div style="margin-bottom: 4px;">📧 ${clientInfo.email}</div>` : ''}
                ${clientInfo.phone ? `<div style="margin-bottom: 4px;">📞 ${clientInfo.phone}</div>` : ''}
                ${clientInfo.gstin ? `<div>🎫 GSTIN: ${clientInfo.gstin}</div>` : ''}
              </div>
            </div>
            
            <!-- Invoice Details -->
            <div style="flex: 1; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-weight: bold; color: #374151; margin-bottom: 18px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">INVOICE DETAILS</div>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px 20px; font-size: 13px;">
                <div style="color: #6b7280; font-weight: 500;">Invoice Number:</div>
                <div style="font-weight: bold; color: #1e40af;">${invoice.invoiceNumber}</div>
                
                <div style="color: #6b7280; font-weight: 500;">Issue Date:</div>
                <div style="font-weight: bold; color: #1f2937;">${new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                
                <div style="color: #6b7280; font-weight: 500;">Due Date:</div>
                <div style="font-weight: bold; color: #1f2937;">${new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                
                <div style="color: #6b7280; font-weight: 500;">Currency:</div>
                <div style="font-weight: bold; color: #1f2937;">${invoice.currency}</div>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <div style="margin-bottom: 35px;">
            <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white;">
                  <th style="padding: 14px 12px; text-align: left; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">#</th>
                  <th style="padding: 14px 12px; text-align: left; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">Description</th>
                  <th style="padding: 14px 12px; text-align: left; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">HSN/SAC</th>
                  <th style="padding: 14px 12px; text-align: center; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">Qty</th>
                  <th style="padding: 14px 12px; text-align: right; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">Price</th>
                  <th style="padding: 14px 12px; text-align: center; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">Tax %</th>
                  <th style="padding: 14px 12px; text-align: right; font-weight: bold; border: 1px solid #1e3a8a; font-size: 13px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item, index) => {
                  const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fafb';
                  return `
                    <tr style="background: ${rowBg}; border-bottom: 1px solid #e5e7eb;">
                      <td style="padding: 14px 12px; font-size: 13px; color: #4b5563;">${index + 1}</td>
                      <td style="padding: 14px 12px; font-size: 13px; color: #1f2937; font-weight: 500;">${item.description || 'N/A'}</td>
                      <td style="padding: 14px 12px; font-size: 13px; color: #6b7280;">${item.hsnCode || 'N/A'}</td>
                      <td style="padding: 14px 12px; text-align: center; font-size: 13px; color: #4b5563;">${item.quantity}</td>
                      <td style="padding: 14px 12px; text-align: right; font-size: 13px; color: #1f2937;">₹${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style="padding: 14px 12px; text-align: center; font-size: 13px; color: #4b5563;">${item.tax}%</td>
                      <td style="padding: 14px 12px; text-align: right; font-weight: bold; font-size: 13px; color: #1f2937;">
                        ₹${((item.quantity * item.price) * (1 + item.tax / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- Totals -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 45px;">
            <div style="width: 420px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #3b82f6; padding: 28px; border-radius: 10px; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
                <span style="color: #4b5563; font-weight: 500;">Subtotal:</span>
                <span style="font-weight: bold; color: #1f2937;">₹${calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
                <span style="color: #4b5563; font-weight: 500;">Tax:</span>
                <span style="font-weight: bold; color: #1f2937;">₹${calculateTax().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              ${calculateDiscount() > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 14px;">
                  <span style="color: #4b5563; font-weight: 500;">Discount:</span>
                  <span style="font-weight: bold; color: #ef4444;">-₹${calculateDiscount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ` : ''}
              
              <div style="border-top: 3px solid #3b82f6; margin: 18px 0; padding-top: 18px;">
                <div style="display: flex; justify-content: space-between; font-size: 22px; font-weight: bold;">
                  <span style="color: #1e40af;">TOTAL:</span>
                  <span style="color: #1e40af;">₹${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 18px; color: #6b7280; font-style: italic; font-size: 12px; padding: 12px; background: rgba(255,255,255,0.6); border-radius: 6px; line-height: 1.6;">
                Amount in Words: ${convertToWords(calculateTotal())}
              </div>
            </div>
          </div>
          
          <!-- Bank Details & Signature -->
          <div style="display: flex; gap: 30px; margin-top: 45px; margin-bottom: 40px;">
            <!-- Bank Details -->
            <div style="flex: 1; border: 1px solid #e5e7eb; padding: 22px; border-radius: 10px; background: #fafafa;">
              <div style="font-weight: bold; color: #374151; margin-bottom: 18px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">BANK DETAILS</div>
              <div style="color: #4b5563; line-height: 2; font-size: 13px;">
                <div><strong style="color: #1f2937;">Bank:</strong> ${companyInfo.bankName}</div>
                <div><strong style="color: #1f2937;">Account Name:</strong> ${companyInfo.name}</div>
                <div><strong style="color: #1f2937;">Account Number:</strong> ${companyInfo.accountNumber}</div>
                <div><strong style="color: #1f2937;">IFSC Code:</strong> ${companyInfo.ifscCode}</div>
                <div><strong style="color: #1f2937;">Branch:</strong> ${companyInfo.branch}</div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                  <div><strong style="color: #1f2937;">GSTIN:</strong> ${companyInfo.gstin}</div>
                  <div><strong style="color: #1f2937;">PAN:</strong> ${companyInfo.pan}</div>
                </div>
              </div>
            </div>
            
            <!-- Signature -->
            <div style="flex: 1; text-align: center; padding-top: 20px;">
              ${signature ? 
                `<img src="${signature}" style="height: 90px; margin-bottom: 15px; max-width: 200px; object-fit: contain;" alt="Signature">` : 
                `<div style="height: 90px; margin-bottom: 15px;"></div>`
              }
              <div style="border-top: 2px solid #374151; width: 220px; margin: 0 auto 12px;"></div>
              <div style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 6px;">Authorized Signatory</div>
              <div style="color: #6b7280; font-size: 13px;">${companyInfo.name}</div>
            </div>
          </div>
          
          <!-- Notes & Terms -->
          <div style="margin-top: 45px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
            ${invoice.notes ? `
              <div style="margin-bottom: 25px;">
                <div style="font-weight: bold; color: #374151; margin-bottom: 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">NOTES</div>
                <div style="color: #4b5563; white-space: pre-line; font-size: 13px; line-height: 1.8; padding-left: 12px; border-left: 3px solid #3b82f6;">${invoice.notes}</div>
              </div>
            ` : ''}
            
            ${invoice.terms ? `
              <div>
                <div style="font-weight: bold; color: #374151; margin-bottom: 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">TERMS & CONDITIONS</div>
                <div style="color: #4b5563; white-space: pre-line; font-size: 13px; line-height: 1.8; padding-left: 12px; border-left: 3px solid #3b82f6;">${invoice.terms}</div>
              </div>
            ` : ''}
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 60px; text-align: center; color: #9ca3af; font-size: 11px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
            <div style="font-weight: 500; color: #6b7280; margin-bottom: 8px;">Thank you for your business!</div>
            <div>Generated on ${new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
        </div>
      `;
      
      document.body.appendChild(pdfContainer);
      
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert to PDF with high quality
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        windowHeight: pdfContainer.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      
      // Clean up
      document.body.removeChild(pdfContainer);
      
      alert('✅ Invoice PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Convert number to words (Indian numbering system)
  const convertToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    
    const toWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + toWords(n % 100) : '');
      if (n < 100000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
      if (n < 10000000) return toWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + toWords(n % 100000) : '');
      return toWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + toWords(n % 10000000) : '');
    };
    
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    
    let words = toWords(rupees) + ' Rupees';
    if (paise > 0) {
      words += ' and ' + toWords(paise) + ' Paise';
    }
    
    return words + ' Only';
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <style>
        @media print {
          body { font-family: 'Helvetica', 'Arial', sans-serif; }
          .no-print { display: none; }
          .invoice-print { padding: 20mm; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; }
          .total-section { background: #f8f9fa; }
        }
      </style>
      <div class="invoice-print">${printContent}</div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Actions */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <BsReceipt className="text-blue-600" />
                  Professional Invoice Generator
                </h1>
                <p className="text-gray-600 mt-2">Create, customize, and download professional invoices</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={copyInvoiceData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  {copySuccess ? <FiCheck className="text-green-600" /> : <FiCopy />}
                  {copySuccess ? 'Copied!' : 'Copy Data'}
                </button>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                    <FaRupeeSign />
                    {calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={generateInvoiceNumber}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
              >
                <FiEdit2 />
                Generate Invoice No.
              </button>
              
              <button
                onClick={() => setInvoice({...invoice, date: new Date().toISOString().split('T')[0]})}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
              >
                <FiCalendar />
                Set Today's Date
              </button>
              
              <button
                onClick={() => setInvoice({...invoice, dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]})}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition"
              >
                <FiCalendar />
                Set Due Date (30 days)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-1 space-y-8">
              {/* Template Selection */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiImage className="text-blue-600" />
                  Invoice Template
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {invoiceTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} ${template.bgColor}`}
                    >
                      <div className={`text-center font-medium ${template.textColor}`}>
                        {template.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaRegBuilding className="text-blue-600" />
                    Company Details
                  </h2>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm text-sm"
                  >
                    <FiUpload />
                    Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                
                {companyLogo && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">Logo Preview</div>
                    <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white p-2">
                      <img 
                        src={companyLogo} 
                        alt="Company Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {Object.entries(companyInfo).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </label>
                      {key === 'address' ? (
                        <textarea
                          value={value}
                          onChange={(e) => setCompanyInfo({...companyInfo, [key]: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          rows="3"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setCompanyInfo({...companyInfo, [key]: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaRegUser className="text-green-600" />
                  Client Details
                </h2>
                <div className="space-y-4">
                  {Object.entries(clientInfo).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </label>
                      {key === 'address' ? (
                        <textarea
                          value={value}
                          onChange={(e) => setClientInfo({...clientInfo, [key]: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          rows="3"
                          placeholder={`Enter client ${key}`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setClientInfo({...clientInfo, [key]: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder={`Enter client ${key}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Upload */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiEdit2 className="text-purple-600" />
                  Digital Signature
                </h2>
                <button
                  onClick={() => signatureInputRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm mb-4"
                >
                  <FiUpload />
                  Upload Signature
                </button>
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
                
                {signature && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Signature Preview</div>
                    <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white p-4">
                      <img 
                        src={signature} 
                        alt="Signature" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Invoice Preview & Configuration */}
            <div className="lg:col-span-2 space-y-8">
              {/* Invoice Preview Header */}
              <div id="printable-invoice" className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                {/* Invoice Header */}
                <div className="border-b-2 border-blue-600 pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {companyLogo ? (
                        <img 
                          src={companyLogo} 
                          alt="Company Logo" 
                          className="h-16 mb-4"
                        />
                      ) : (
                        <div className="text-2xl font-bold text-blue-700 mb-4">{companyInfo.name}</div>
                      )}
                      <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                        {companyInfo.address}
                      </div>
                      <div className="mt-2 text-gray-500">
                        <div>📧 {companyInfo.email}</div>
                        <div>📞 {companyInfo.phone}</div>
                        <div>🌐 {companyInfo.website}</div>
                        <div>🎫 GSTIN: {companyInfo.gstin}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-700 mb-2">INVOICE</div>
                      <div className="text-xl font-bold text-gray-800">{invoice.invoiceNumber}</div>
                      <div className={`mt-3 px-4 py-2 rounded-full text-sm font-bold inline-block ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client & Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <div className="font-bold text-gray-700 mb-3 text-lg">BILL TO</div>
                    <div className="font-bold text-blue-700 text-xl mb-2">{clientInfo.name}</div>
                    <div className="text-gray-600 whitespace-pre-line mb-3">{clientInfo.address}</div>
                    {clientInfo.email && <div className="text-gray-500">📧 {clientInfo.email}</div>}
                    {clientInfo.phone && <div className="text-gray-500">📞 {clientInfo.phone}</div>}
                    {clientInfo.gstin && <div className="text-gray-500">🎫 GSTIN: {clientInfo.gstin}</div>}
                  </div>
                  
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="font-bold text-gray-700 mb-3 text-lg">INVOICE DETAILS</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="font-bold">{invoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-bold">
                          {new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-bold">
                          {new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-bold">{invoice.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left font-bold">#</th>
                        <th className="p-3 text-left font-bold">Description</th>
                        <th className="p-3 text-left font-bold">HSN/SAC</th>
                        <th className="p-3 text-left font-bold">Qty</th>
                        <th className="p-3 text-left font-bold">Price</th>
                        <th className="p-3 text-left font-bold">Tax %</th>
                        <th className="p-3 text-left font-bold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.hsnCode}
                              onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)}
                              className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="HSN Code"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                              min="1"
                            />
                          </td>
                          <td className="p-3">
                            <div className="relative">
                              <FaRupeeSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                className="w-28 pl-8 pr-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.tax}
                              onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                              min="0"
                              step="0.1"
                            />
                          </td>
                          <td className="p-3 font-bold">
                            <div className="flex items-center gap-1">
                              <FaRupeeSign />
                              {((item.quantity * item.price) * (1 + item.tax / 100)).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <button
                    onClick={addItem}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                  >
                    <FiPlus />
                    Add New Item
                  </button>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-96 bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-bold">
                          <FaRupeeSign className="inline mr-1" />
                          {calculateSubtotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-bold">
                          <FaRupeeSign className="inline mr-1" />
                          {calculateTax().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-bold text-red-600">
                            -<FaRupeeSign className="inline mr-1" />
                            {calculateDiscount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                      
                      <div className="border-t border-blue-300 pt-3 mt-3">
                        <div className="flex justify-between text-2xl font-bold">
                          <span className="text-blue-700">TOTAL:</span>
                          <span className="text-blue-700">
                            <FaRupeeSign className="inline mr-1" />
                            {calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-600 italic text-sm mt-4">
                        Amount in Words: {convertToWords(calculateTotal())}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details & Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-gray-300 p-5 rounded-xl">
                    <div className="font-bold text-gray-700 mb-3">BANK DETAILS</div>
                    <div className="text-gray-600 space-y-1">
                      <div><strong>Bank:</strong> {companyInfo.bankName}</div>
                      <div><strong>Account Name:</strong> {companyInfo.name}</div>
                      <div><strong>Account No:</strong> {companyInfo.accountNumber}</div>
                      <div><strong>IFSC:</strong> {companyInfo.ifscCode}</div>
                      <div><strong>Branch:</strong> {companyInfo.branch}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {signature && (
                      <img 
                        src={signature} 
                        alt="Signature" 
                        className="h-20 mx-auto mb-2"
                      />
                    )}
                    <div className="border-t border-gray-400 w-48 mx-auto mb-2"></div>
                    <div className="font-bold text-gray-700">Authorized Signatory</div>
                    <div className="text-gray-600">{companyInfo.name}</div>
                  </div>
                </div>

                {/* Notes & Terms */}
                <div className="border-t border-gray-300 pt-6">
                  {invoice.notes && (
                    <div className="mb-6">
                      <div className="font-bold text-gray-700 mb-2">NOTES</div>
                      <div className="text-gray-600 whitespace-pre-line">{invoice.notes}</div>
                    </div>
                  )}
                  
                  {invoice.terms && (
                    <div>
                      <div className="font-bold text-gray-700 mb-2">TERMS & CONDITIONS</div>
                      <div className="text-gray-600 whitespace-pre-line">{invoice.terms}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Configuration */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Status</label>
                    <select
                      value={invoice.status}
                      onChange={(e) => setInvoice({...invoice, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={invoice.discountType}
                      onChange={(e) => setInvoice({...invoice, discountType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {invoice.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount (₹)'}
                    </label>
                    <div className="relative">
                      {invoice.discountType === 'fixed' && (
                        <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      )}
                      <input
                        type="number"
                        value={invoice.discount}
                        onChange={(e) => setInvoice({...invoice, discount: parseFloat(e.target.value) || 0})}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${invoice.discountType === 'fixed' ? 'pl-10' : ''}`}
                        min="0"
                        step={invoice.discountType === 'percentage' ? '0.1' : '1'}
                        max={invoice.discountType === 'percentage' ? '100' : ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={invoice.notes}
                      onChange={(e) => setInvoice({...invoice, notes: e.target.value})}
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Terms & Conditions</label>
                    <textarea
                      value={invoice.terms}
                      onChange={(e) => setInvoice({...invoice, terms: e.target.value})}
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter terms and conditions..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                  <FiPrinter />
                  Print Invoice
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition shadow-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'}`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Invoice
                    </>
                  )}
                </button>
                
                <button
                  onClick={exportToPDF}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition shadow-sm"
                >
                  <FiDownload />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoiceGenerator;