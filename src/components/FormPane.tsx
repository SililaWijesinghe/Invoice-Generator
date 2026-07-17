import React, { useState } from 'react';
import { InvoiceData, LineItem } from '../types';
import { ChevronDown, ChevronUp, GripVertical, Image as ImageIcon, Plus, Trash2, Save, FileDown, Upload, RefreshCw, LayoutTemplate, Building2, UserCircle2, FileText, ListOrdered, HandHeart, Landmark, PanelBottom } from 'lucide-react';
import { fileToBase64 } from '../utils';
import { v4 as uuidv4 } from 'uuid';

interface FormPaneProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function FormPane({ data, onChange }: FormPaneProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    company: false,
    client: true,
    meta: false,
    items: true,
    csr: false,
    bank: false,
    footer: false
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateNested = (section: keyof InvoiceData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoDataUrl' | 'sealDataUrl') => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      updateNested('company', field, base64);
    }
  };

  const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIdx === null || draggedItemIdx === index) return;
    
    const items = [...data.lineItems];
    const draggedItem = items[draggedItemIdx];
    
    items.splice(draggedItemIdx, 1);
    items.splice(index, 0, draggedItem);
    
    setDraggedItemIdx(index);
    onChange({ ...data, lineItems: items });
  };

  const handleDragEnd = () => {
    setDraggedItemIdx(null);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: uuidv4(),
      serialNo: String(data.lineItems.length + 1).padStart(3, '0'),
      description: '',
      amount: 0,
    };
    onChange({ ...data, lineItems: [...data.lineItems, newItem] });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    onChange({
      ...data,
      lineItems: data.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeLineItem = (id: string) => {
    onChange({
      ...data,
      lineItems: data.lineItems.filter(item => item.id !== id)
    });
  };

  const saveProfile = () => {
    const profileName = prompt("Enter a name to save this profile:");
    if (profileName) {
      const profile = { company: data.company, csr: data.csr, bank: data.bank, template: data.template };
      localStorage.setItem(`invoice_profile_${profileName}`, JSON.stringify(profile));
      alert(`Profile '${profileName}' saved!`);
    }
  };

  const loadProfile = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('invoice_profile_'));
    if (keys.length === 0) {
      alert("No saved profiles found.");
      return;
    }
    const profileNames = keys.map(k => k.replace('invoice_profile_', ''));
    const selected = prompt(`Select a profile to load:\n${profileNames.join('\n')}`);
    if (selected && keys.includes(`invoice_profile_${selected}`)) {
      const profileData = JSON.parse(localStorage.getItem(`invoice_profile_${selected}`) || '{}');
      onChange({ ...data, ...profileData });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the form? All unsaved data will be lost.')) {
      window.location.reload();
    }
  };

  const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-cyan-500 transition-colors text-slate-300";
  const labelClass = "block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider";

  const Section = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggleSection(id)}>
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {expandedSections[id] ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
      </div>
      {expandedSections[id] && (
        <div className="space-y-4 pl-7">
          {children}
        </div>
      )}
    </section>
  );

  return (
    <>
      <div className="p-6 space-y-8 overflow-y-auto grow">
        
        {/* Profile Actions */}
        <div className="flex gap-2 justify-end">
          <button onClick={handleReset} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Reset Form">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={saveProfile} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Save Profile">
            <Save className="w-4 h-4" />
          </button>
          <button onClick={loadProfile} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors" title="Load Profile">
            <FileDown className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector */}
        <section>
          <label className={labelClass + " mb-3"}>Template Selector</label>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => onChange({ ...data, template: 'A' })}
              className={`p-3 rounded-xl cursor-pointer relative overflow-hidden transition-all ${data.template === 'A' ? 'border-2 border-cyan-500 bg-slate-800/50' : 'border-2 border-transparent bg-slate-900 hover:border-slate-700'}`}
            >
              {data.template === 'A' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
              <div className="h-12 w-full bg-white/10 rounded mb-2 flex items-center justify-center">
                <LayoutTemplate className="w-6 h-6 text-slate-500" />
              </div>
              <span className={`text-xs font-medium block text-center ${data.template === 'A' ? 'text-slate-200' : 'text-slate-500'}`}>Template A (Seal)</span>
            </div>
            
            <div 
              onClick={() => onChange({ ...data, template: 'B' })}
              className={`p-3 rounded-xl cursor-pointer relative overflow-hidden transition-all ${data.template === 'B' ? 'border-2 border-cyan-500 bg-slate-800/50' : 'border-2 border-transparent bg-slate-900 hover:border-slate-700'}`}
            >
              {data.template === 'B' && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
              <div className="h-12 w-full bg-white/10 rounded mb-2 flex items-center justify-center">
                <LayoutTemplate className="w-6 h-6 text-slate-500" />
              </div>
              <span className={`text-xs font-medium block text-center ${data.template === 'B' ? 'text-slate-200' : 'text-slate-500'}`}>Template B (Multi-Sig)</span>
            </div>
          </div>
        </section>

        <Section id="company" title="Company Details" icon={Building2}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Logo</label>
              <div className="mt-1 flex justify-center p-4 border-2 border-slate-700 border-dashed rounded-lg hover:bg-slate-800 relative group">
                {data.company.logoDataUrl ? (
                  <>
                    <img src={data.company.logoDataUrl} alt="Logo" className="h-12 object-contain bg-white/10 rounded" />
                    <button onClick={() => updateNested('company', 'logoDataUrl', null)} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer text-center flex flex-col items-center">
                    <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-xs text-cyan-500">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoDataUrl')} />
                  </label>
                )}
              </div>
            </div>
            {data.template === 'A' && (
              <div>
                <label className={labelClass}>Seal</label>
                <div className="mt-1 flex justify-center p-4 border-2 border-slate-700 border-dashed rounded-lg hover:bg-slate-800 relative group">
                  {data.company.sealDataUrl ? (
                    <>
                      <img src={data.company.sealDataUrl} alt="Seal" className="h-12 object-contain bg-white/10 rounded" />
                      <button onClick={() => updateNested('company', 'sealDataUrl', null)} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer text-center flex flex-col items-center">
                      <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                      <span className="text-xs text-cyan-500">Upload</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'sealDataUrl')} />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" value={data.company.companyName} onChange={e => updateNested('company', 'companyName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea rows={3} value={data.company.addressLines} onChange={e => updateNested('company', 'addressLines', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phones</label>
              <input type="text" value={data.company.phones.join(', ')} onChange={e => updateNested('company', 'phones', e.target.value.split(',').map(s=>s.trim()))} className={inputClass} placeholder="Comma separated" />
            </div>
            <div>
              <label className={labelClass}>Emails</label>
              <input type="text" value={data.company.emails.join(', ')} onChange={e => updateNested('company', 'emails', e.target.value.split(',').map(s=>s.trim()))} className={inputClass} placeholder="Comma separated" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="text" value={data.company.website} onChange={e => updateNested('company', 'website', e.target.value)} className={inputClass} />
          </div>
        </Section>

        <Section id="client" title="Client Information" icon={UserCircle2}>
          <div>
            <label className={labelClass}>Client Name *</label>
            <input type="text" value={data.client.clientName} onChange={e => updateNested('client', 'clientName', e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Client Company</label>
            <input type="text" value={data.client.clientCompanyName} onChange={e => updateNested('client', 'clientCompanyName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <textarea rows={2} value={data.client.addressLines} onChange={e => updateNested('client', 'addressLines', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Mobile</label>
              <input type="text" value={data.client.mobile} onChange={e => updateNested('client', 'mobile', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={data.client.email} onChange={e => updateNested('client', 'email', e.target.value)} className={inputClass} />
            </div>
          </div>
        </Section>

        <Section id="meta" title="Invoice Details" icon={FileText}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Invoice No *</label>
              <input type="text" value={data.meta.invoiceNo} onChange={e => updateNested('meta', 'invoiceNo', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="text" value={data.meta.date} onChange={e => updateNested('meta', 'date', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Payment Type</label>
              <input type="text" value={data.meta.paymentType} onChange={e => updateNested('meta', 'paymentType', e.target.value)} className={inputClass} list="payment-types" />
              <datalist id="payment-types">
                <option value="Online" />
                <option value="Cash" />
                <option value="Cheque" />
                <option value="Bank Transfer" />
              </datalist>
            </div>
            <div>
              <label className={labelClass}>Approved By</label>
              <input type="text" value={data.meta.approvedBy} onChange={e => updateNested('meta', 'approvedBy', e.target.value)} className={inputClass} />
            </div>
          </div>
        </Section>

        <Section id="items" title="Line Items" icon={ListOrdered}>
          <div className="space-y-3">
            {data.lineItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex gap-3 items-start bg-slate-900 border border-slate-700 p-3 rounded-lg transition-opacity ${draggedItemIdx === index ? 'opacity-50' : 'opacity-100'}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="pt-2 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-3">
                    <label className={labelClass}>Serial</label>
                    <input type="text" value={item.serialNo} onChange={e => updateLineItem(item.id, 'serialNo', e.target.value)} className={inputClass} />
                  </div>
                  <div className="col-span-9">
                    <label className={labelClass}>Description</label>
                    <textarea rows={1} value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)} className={inputClass} />
                  </div>
                  <div className="col-span-12">
                    <label className={labelClass}>Amount (LKR)</label>
                    <input type="number" value={item.amount} onChange={e => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)} className={inputClass} />
                  </div>
                </div>
                <button onClick={() => removeLineItem(item.id)} className="pt-2 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addLineItem} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-sm font-medium text-slate-400 hover:border-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
          </div>
        </Section>

        <Section id="csr" title="CSR Settings" icon={HandHeart}>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="csr-enabled" checked={data.csr.enabled} onChange={e => updateNested('csr', 'enabled', e.target.checked)} className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950" />
            <label htmlFor="csr-enabled" className="text-sm font-medium text-slate-300">Enable CSR Footer Message</label>
          </div>
          {data.csr.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Donation Amount</label>
                  <input type="text" value={data.csr.donationAmount} onChange={e => updateNested('csr', 'donationAmount', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cause</label>
                  <input type="text" value={data.csr.causeName} onChange={e => updateNested('csr', 'causeName', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Custom Message</label>
                <textarea rows={4} value={data.csr.customMessage} onChange={e => updateNested('csr', 'customMessage', e.target.value)} className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Use {'{donationAmount}'} and {'{causeName}'} as placeholders.</p>
              </div>
            </div>
          )}
        </Section>

        <Section id="bank" title="Bank Details" icon={Landmark}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Account Name</label>
              <input type="text" value={data.bank.accountName} onChange={e => updateNested('bank', 'accountName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Account Number</label>
              <input type="text" value={data.bank.accountNumber} onChange={e => updateNested('bank', 'accountNumber', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bank Name</label>
              <input type="text" value={data.bank.bankName} onChange={e => updateNested('bank', 'bankName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Branch</label>
              <input type="text" value={data.bank.branchName} onChange={e => updateNested('bank', 'branchName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SWIFT Code</label>
              <input type="text" value={data.bank.swiftCode} onChange={e => updateNested('bank', 'swiftCode', e.target.value)} className={inputClass} />
            </div>
          </div>
        </Section>
        
        <Section id="footer" title="Footer" icon={PanelBottom}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Printed By</label>
              <input type="text" value={data.footer.printedBy} onChange={e => updateNested('footer', 'printedBy', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Printed On</label>
              <input type="text" value={data.footer.printedOnDate} onChange={e => updateNested('footer', 'printedOnDate', e.target.value)} className={inputClass} />
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-auto p-6 bg-slate-900/50 border-t border-slate-800 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-500">Auto-Calculating Total</span>
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">LKR {data.netTotal.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="bg-cyan-500 h-full w-[85%] rounded-full"></div>
        </div>
        {data.netTotal === 0 && (
          <div className="text-amber-500 text-xs mt-2 px-1">
            Warning: Net Total is 0. Please enter item amounts.
          </div>
        )}
      </div>
    </>
  );
}
