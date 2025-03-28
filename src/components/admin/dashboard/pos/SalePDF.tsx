// PDFExportButton.jsx
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { formatCurrency } from '@/lib/utils';
import { DownloadIcon, PrinterIcon, XIcon } from 'lucide-react';
import { SaleForm } from '@/schemas/sales';
import { Customer } from '@/schemas/customers';
import { useFormContext } from 'react-hook-form';

interface CreateButtonProps {
  customer?: Customer;
  documentDetails: SaleForm['documentDetails'];
  total: number;
  subtotal: number;
  tax: number;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SalePDF({ total, subtotal, tax, openDialog, setOpenDialog, documentDetails, customer }: CreateButtonProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { reset } = useFormContext<SaleForm>();

  const generatePDF = async (action = 'download') => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 5, // Mejor calidad
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: pdfRef.current.scrollWidth,
        windowHeight: pdfRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Ancho A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      if (action === 'download') {
        pdf.save('factura.pdf');
      } else if (action === 'print') {
        // Crear una nueva ventana para imprimir
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl);

        if (printWindow) {
          // Esperar a que se cargue el PDF antes de imprimir
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const handleDownloadPDF = () => {
    generatePDF('download');
  };

  const handlePrintPDF = () => {
    generatePDF('print');
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="min-w-fit"
          onInteractOutside={(e) => e.preventDefault()}
          onCloseAutoFocus={() => {
            reset();
          }}
        >
          <DialogHeader>
            <DialogTitle>Comprobante</DialogTitle>
            <DialogDescription>Vista previa del comprobante</DialogDescription>
          </DialogHeader>

          <div className="max-h-[80vh] min-w-fit overflow-auto">
            <div id="factura-html" ref={pdfRef} className="px-8 py-5 bg-white mx-auto shadow-none flex flex-col w-[210mm] h-[297mm]">
              {/* Encabezado */}
              <div className="flex justify-between">
                <div>
                  <img src="/placeholder.svg" alt="imagen" className="w-[73mm] h-[23mm] object-cover" />
                  <div className="text-left mt-1">
                    <h1 className="text-sm font-bold">REPRESENTACIONES NATALY S.A.C.</h1>
                    <p className="text-[9px]">AV. ISABEL LA CATOLICA NRO. 1837 - LIMA</p>
                    <p className="text-[9px]">Telefonos :(51-1) 3242535/980090445</p>
                    <p className="text-[9px]">representacionesnataly@hotmail.com</p>
                  </div>
                </div>
                <div></div>
              </div>

              <div className="border-1 border-gray-500 text-xs mt-2 flex flex-col gap-y-1 pb-1">
                <span className="bg-blue-invoice pr-4 pl-1 py-1 text-white font-bold w-fit">Datos del Documento:</span>
                <p className="px-2">Cliente: {customer?.name}</p>
                <p className="px-2">Dirección: {customer?.address}</p>
                <p className="px-2">RUC: {customer?.document}</p>
                <p className="px-2">Forma de pago: Efectivo</p>
              </div>

              {/* Tabla de productos */}
              <div className="flex-1 border border-gray-500 mt-2">
                <table className="text-xs w-full">
                  <thead className="">
                    <tr className="bg-blue-invoice text-white">
                      <th className="border-gray-500 p-2 text-left">Producto</th>
                      <th className="border-gray-500 p-2 text-center">Cantidad</th>
                      <th className="border-gray-500 p-2 text-center">Precio</th>
                      <th className="border-gray-500 p-2 text-center">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentDetails.map((item) => (
                      <tr key={item.id}>
                        <td className="border-gray-500 p-2">{item.productName}</td>
                        <td className="border-gray-500 p-2 text-center">{item.quantity}</td>
                        <td className="border-gray-500 p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="border-gray-500 p-2 text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="border border-gray-500 mt-2 text-xs">
                <div className="flex justify-end">
                  <div className="w-[105mm] grid grid-cols-2">
                    <div>
                      <div className="border-b border-gray-500 font-bold bg-blue-invoice text-white px-1 py-1">OP. GRAVADA:</div>
                      <div className="border-b border-gray-500 font-bold bg-blue-invoice text-white px-1 py-1">IGV 18%:</div>
                      <div className="font-bold bg-blue-invoice text-white px-1 py-1">TOTAL:</div>
                    </div>

                    <div>
                      <div className="border-b border-gray-500 text-right px-1 py-1 font-bold">{formatCurrency(subtotal)}</div>
                      <div className="border-b border-gray-500 text-right px-1 py-1 font-bold">{formatCurrency(tax)}</div>
                      <div className="text-right px-1 py-1 font-bold">{formatCurrency(total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" onClick={() => setOpenDialog(false)}>
              <XIcon />
              <span>Salir</span>
            </Button>
            <Button className="cursor-pointer bg-red-700 hover:bg-red-800" type="button" onClick={handleDownloadPDF}>
              <DownloadIcon />
              <span>PDF</span>
            </Button>
            <Button className="cursor-pointer bg-blue-700 hover:bg-blue-800" type="button" onClick={handlePrintPDF}>
              <PrinterIcon />
              <span>Imprimir</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
