import React from 'react';
import { InvoiceData } from '../types';
import InvoiceTemplateA from './InvoiceTemplateA';
import InvoiceTemplateB from './InvoiceTemplateB';

interface PreviewPaneProps {
  data: InvoiceData;
}

export default function PreviewPane({ data }: PreviewPaneProps) {
  return (
    <div className="w-full flex justify-center overflow-x-auto pb-8 print:overflow-visible print:pb-0">
      <div className="shrink-0 w-[210mm] min-h-[297mm] bg-white shadow-2xl shadow-black/50 ring-1 ring-slate-800 print:shadow-none print:ring-0">
        <div 
          id="invoice-preview-container" 
          className="w-[210mm] min-h-[297mm] bg-[#ffffff] text-[#000000] font-sans relative box-border"
        >
          {data.template === 'A' ? (
            <InvoiceTemplateA data={data} />
          ) : (
            <InvoiceTemplateB data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
