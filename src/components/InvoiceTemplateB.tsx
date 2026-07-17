import React from 'react';
import { InvoiceData } from '../types';
import { formatCurrency } from '../utils';

export default function InvoiceTemplateB({ data }: { data: InvoiceData }) {
  const parseCsrMessage = () => {
    let msg = data.csr.customMessage;
    msg = msg.replace('{donationAmount}', data.csr.donationAmount);
    msg = msg.replace('{causeName}', data.csr.causeName);
    return msg;
  };

  return (
    <div className="p-10 flex flex-col min-h-[297mm] text-[11px] leading-snug">
      
      {/* 1. Header */}
      <div className="flex items-start gap-6 mb-6">
        {data.company.logoDataUrl ? (
          <img src={data.company.logoDataUrl} alt="Company Logo" className="w-[70px] h-auto object-contain" />
        ) : (
          <div className="w-[70px] h-[70px] bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] text-xs border border-[#d1d5db]">Logo</div>
        )}
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide">{data.company.companyName}</h1>
          <div className="whitespace-pre-line mt-1">{data.company.addressLines}</div>
          <div className="mt-1">
            {data.company.phones.length > 0 && <span>Tel: {data.company.phones.join(' | ')}</span>}
          </div>
          <div>
            {data.company.emails.length > 0 && <span>Email: {data.company.emails.join(' | ')}</span>}
          </div>
          <div>
            {data.company.website && <span>Web: {data.company.website}</span>}
          </div>
        </div>
      </div>

      {/* 2 & 3 & 4. Divider, Invoice Box, Divider */}
      <div className="border-t border-[#000000] mb-4"></div>
      <div className="flex justify-center mb-4">
        <div className="border border-[#000000] px-8 py-1">
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase">Invoice</h2>
        </div>
      </div>
      <div className="border-t border-[#000000] mb-6"></div>

      {/* 5. Two-column bordered info block */}
      <div className="flex border border-[#000000] mb-8">
        <div className="w-1/2 border-r border-[#000000] p-3">
          <div className="font-bold text-[10px] text-[#4b5563] uppercase mb-1">Bill To</div>
          <div className="font-bold text-[13px] mb-1">{data.client.clientName}</div>
          {data.client.clientCompanyName && <div className="mb-1">Company: {data.client.clientCompanyName}</div>}
          <div className="whitespace-pre-line mb-1">{data.client.addressLines}</div>
          {data.client.mobile && <div className="mb-1">Mobile: {data.client.mobile}</div>}
          {data.client.email && <div>Email: {data.client.email}</div>}
        </div>
        <div className="w-1/2 p-3">
          <table className="w-full h-full">
            <tbody>
              <tr>
                <td className="py-1 font-bold w-1/3">Date:</td>
                <td className="py-1">{data.meta.date}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Invoice No:</td>
                <td className="py-1">{data.meta.invoiceNo}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Payment Type:</td>
                <td className="py-1">{data.meta.paymentType}</td>
              </tr>
              <tr>
                <td className="py-1 font-bold">Approved By:</td>
                <td className="py-1">{data.meta.approvedBy}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Line items table */}
      <table className="w-full border-collapse border border-[#000000] mb-10">
        <thead>
          <tr className="border-b border-[#000000]">
            <th className="border-r border-[#000000] p-2 text-center w-[10%] font-bold">Serial No</th>
            <th className="border-r border-[#000000] p-2 text-left w-[70%] font-bold">Description</th>
            <th className="p-2 text-right w-[20%] font-bold">Amount(LKR)</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item, index) => (
            <tr key={index} className="border-b border-[#000000] last:border-b-0">
              <td className="border-r border-[#000000] p-2 text-center align-top">{item.serialNo}</td>
              <td className="border-r border-[#000000] p-2 whitespace-pre-wrap align-top">{item.description}</td>
              <td className="p-2 text-right align-top">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
          {/* Spacer row */}
          <tr className="border-b border-[#000000]">
            <td className="border-r border-[#000000] p-2 h-8"></td>
            <td className="border-r border-[#000000] p-2"></td>
            <td className="p-2"></td>
          </tr>
          <tr className="border-t-[2px] border-[#000000]">
            <td colSpan={2} className="border-r border-[#000000] p-2 text-right font-bold uppercase">Net Total (LKR)</td>
            <td className="p-2 text-right font-bold">{formatCurrency(data.netTotal)}</td>
          </tr>
        </tbody>
      </table>

      {/* 7 & 8. Signatures Block */}
      <div className="mb-10">
        {/* Row A: Authorized Signatures */}
        <div className="flex gap-6 justify-between text-center mb-8">
          <div className="flex-1">
            <div className="font-bold mb-8 uppercase text-[10px]">Checked By</div>
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div className="text-left text-[10px]">Date: ........................</div>
          </div>
          <div className="flex-1">
            <div className="font-bold mb-8 uppercase text-[10px]">Approved By</div>
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div className="text-left text-[10px]">Date: ........................</div>
          </div>
          <div className="flex-1">
            <div className="font-bold mb-8 uppercase text-[10px]">Authorized Signature 1</div>
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div className="text-left text-[10px]">Date: ........................</div>
          </div>
          <div className="flex-1">
            <div className="font-bold mb-8 uppercase text-[10px]">Authorized Signature 2</div>
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div className="text-left text-[10px]">Date: ........................</div>
          </div>
        </div>

        {/* Row B: Received By */}
        <div className="font-bold mb-8 uppercase text-[10px]">Received By:</div>
        <div className="flex gap-4 justify-between text-center">
          <div className="flex-1">
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div>Name</div>
          </div>
          <div className="flex-1">
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div>NIC</div>
          </div>
          <div className="flex-1">
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div>Signature</div>
          </div>
          <div className="flex-1">
            <div className="border-b border-dashed border-[#000000] mb-2"></div>
            <div>Date</div>
          </div>
        </div>
      </div>

      {/* Push footer to bottom */}
      <div className="mt-auto">
        
        {/* 9. CSR Paragraph */}
        {data.csr.enabled && (
          <div className="text-[9.5px] text-left mb-6 border-t border-[#e5e7eb] pt-4">
            {parseCsrMessage()}
          </div>
        )}

        {/* 10. Bank Details */}
        <div className="border-t border-b border-[#000000] py-2 mb-4 text-center">
          <div className="font-bold mb-1 uppercase text-[10px]">Bank Details</div>
          <div>Account Name - {data.bank.accountName} | Account Number – {data.bank.accountNumber}</div>
          <div>Bank Name - {data.bank.bankName} | Branch Name – {data.bank.branchName} | Swift Code - {data.bank.swiftCode}</div>
        </div>

        {/* 11. Footer Row */}
        <div className="flex justify-between items-end text-[9px] text-[#4b5563] uppercase">
          <div>
            <div>Printed by: {data.footer.printedBy}</div>
            <div>Printed on: {data.footer.printedOnDate}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">{data.company.companyName}</div>
            {data.company.website && <div>{data.company.website}</div>}
          </div>
        </div>
      </div>

    </div>
  );
}
