import React, { useState, useEffect } from 'react';
import { InvoiceData } from './types';
import FormPane from './components/FormPane';
import PreviewPane from './components/PreviewPane';
import { Download, Printer } from 'lucide-react';
import { generatePDF } from './utils';

const DEFAULT_INVOICE_DATA: InvoiceData = {
  template: 'A',
  company: {
    logoDataUrl: null,
    sealDataUrl: null,
    companyName: 'Corporate Advisors (Pvt) Ltd',
    addressLines: 'No 15, Station Road,\nColombo 03,\nSri Lanka.',
    phones: ['011-255 5555', '077-777 7777'],
    emails: ['info@corporateadvisors.lk'],
    website: 'www.corporateadvisors.lk',
  },
  client: {
    clientName: 'Mr. Nuwan Perera',
    addressLines: 'No 42, Galle Road,\nColombo 06.',
    mobile: '071-123 4567',
    clientCompanyName: 'Tech Solutions Ltd',
    email: 'nuwan@techsolutions.lk',
  },
  meta: {
    invoiceNo: 'INV-2026-001',
    date: new Date().toDateString(),
    paymentType: 'Online',
    approvedBy: 'Kasun Silva',
  },
  lineItems: [
    { id: '1', serialNo: '001', description: 'Annual Corporate Secretarial Retainer\n(Jan - Dec 2026)', amount: 50000 },
    { id: '2', serialNo: '002', description: 'Company Registration Fees', amount: 15000 },
  ],
  netTotal: 65000,
  csr: {
    enabled: true,
    donationAmount: 'Rs. 500',
    causeName: 'National Cancer Institute – Apeksha Hospital',
    customMessage: 'As part of our Corporate Social Responsibility and our commitment to being responsible citizens of Sri Lanka, we pledge to donate {donationAmount} from every invoice you receive from us to {causeName}. By simply doing business with us, you too become a part of this meaningful cause. Thank you for your continued support and for joining us in making a difference. Together, we care. Together, we give.',
  },
  bank: {
    accountName: 'Corporate Advisors (Pvt) Ltd',
    accountNumber: '1000 1234 5678',
    bankName: 'Commercial Bank',
    branchName: 'Kollupitiya Branch',
    swiftCode: 'CBCE LKCE',
  },
  footer: {
    printedBy: 'Admin User',
    printedOnDate: new Date().toLocaleDateString(),
  },
};

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const total = invoiceData.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setInvoiceData(prev => ({ ...prev, netTotal: total }));
  }, [invoiceData.lineItems]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generatePDF('invoice-preview-container', invoiceData.meta.invoiceNo);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#020617] text-slate-200 font-sans overflow-hidden print:h-auto print:overflow-visible">
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0f172a] shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white">InvoiceStudio <span className="text-cyan-400 font-normal">Pro</span></h1>
        </div>
        
        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex bg-slate-800 rounded-lg p-1">
          <button 
            className={`px-4 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === 'edit' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit
          </button>
          <button 
            className={`px-4 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === 'preview' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors font-medium text-slate-200">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm transition-colors font-medium shadow-lg shadow-cyan-900/20">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </header>

      <main className="flex grow overflow-hidden print:block print:overflow-visible">
        <aside className={`w-full md:w-[40%] bg-[#0f172a] border-r border-slate-800 flex flex-col print:hidden ${activeTab === 'edit' ? 'flex' : 'hidden md:flex'}`}>
          <FormPane data={invoiceData} onChange={setInvoiceData} />
        </aside>

        <section className={`w-full md:w-[60%] bg-slate-950 flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white print:w-full print:block print:h-auto ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
          <PreviewPane data={invoiceData} />
        </section>
      </main>
    </div>
  );
}
