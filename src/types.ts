export interface CompanyProfile {
  logoDataUrl: string | null;
  sealDataUrl: string | null; // Template A only
  companyName: string;
  addressLines: string;
  phones: string[];
  emails: string[];
  website: string;
}

export interface ClientInfo {
  clientName: string;
  addressLines: string;
  mobile: string;
  clientCompanyName: string;
  email: string;
}

export interface InvoiceMeta {
  invoiceNo: string;
  date: string;
  paymentType: string;
  approvedBy: string;
}

export interface LineItem {
  id: string;
  serialNo: string;
  description: string;
  amount: number;
}

export interface CsrSettings {
  enabled: boolean;
  donationAmount: string;
  causeName: string;
  customMessage: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  swiftCode: string;
}

export interface FooterMeta {
  printedBy: string;
  printedOnDate: string;
}

export interface InvoiceData {
  template: 'A' | 'B';
  company: CompanyProfile;
  client: ClientInfo;
  meta: InvoiceMeta;
  lineItems: LineItem[];
  netTotal: number;
  csr: CsrSettings;
  bank: BankDetails;
  footer: FooterMeta;
}
