import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const generatePDF = async (elementId: string, invoiceNo: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const imgData = await htmlToImage.toPng(element, {
      pixelRatio: 3, // Higher resolution
      backgroundColor: '#ffffff',
    });
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Use A4 aspect ratio instead of actual canvas aspect ratio 
    // to ensure the image scales to fit the page exactly.
    // Given the container is 210x297mm, it should perfectly map to A4.
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${invoiceNo || 'Draft'}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
