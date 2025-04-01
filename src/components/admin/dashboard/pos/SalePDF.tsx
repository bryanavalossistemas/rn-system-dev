import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
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
  saleDetails: SaleForm['saleDetails'];
  total: number;
  subtotal: number;
  tax: number;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SalePDF({ total, subtotal, tax, openDialog, setOpenDialog, saleDetails, customer }: CreateButtonProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { reset } = useFormContext<SaleForm>();

  const generatePDF = async (action: 'download' | 'print' = 'download') => {
    if (!pdfRef.current) return;

    try {
      const startTime = performance.now();

      // 1. Generar imagen PNG del HTML
      const pngDataUrl = await toPng(pdfRef.current, {
        quality: 0.9,
        pixelRatio: 1.5,
        skipFonts: true,
        cacheBust: false,
        skipAutoScale: true,
        filter: (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as HTMLElement;
            return !(elem.style.opacity === '0' || elem.style.visibility === 'hidden' || elem.style.display === 'none');
          }
          return true;
        },
      });

      // 2. Crear PDF y procesar imagen en paralelo
      const pdfDoc = await PDFDocument.create();
      const pngImage = await pdfDoc.embedPng(pngDataUrl);

      const page = pdfDoc.addPage([595, 842]);
      const { width, height } = pngImage.scale(1);
      const scale = Math.min(595 / width, 842 / height);

      page.drawImage(pngImage, {
        x: 0,
        y: 842 - height * scale,
        width: width * scale,
        height: height * scale,
      });

      // 3. Guardar PDF con opciones de compresión
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        // Opción alternativa para compresión si 'compress' no funciona
        // useCompression: true
      });

      // 4. Manejo de la descarga/impresión
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      if (action === 'download') {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `factura_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(pdfUrl);
        }, 100);
      } else {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print();
            setTimeout(() => document.body.removeChild(iframe), 5000);
          }, 500);
        };
      }

      console.log(`PDF generado en ${performance.now() - startTime}ms`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const handleDownloadPDF = () => generatePDF('download');
  const handlePrintPDF = () => generatePDF('print');

  // El resto de tu componente permanece igual...
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
            {/* Tu contenido HTML para el PDF (igual que antes) */}
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
                <p className="px-2">RUC: {customer?.documentNumber}</p>
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
                    {saleDetails.map((item) => (
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
