import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateRange3({ dateOption }: { dateOption: string }) {
  const now = new Date();
  let startDate, endDate;

  switch (dateOption) {
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1).toISOString();
      endDate = new Date(now.getFullYear(), 12, 1).toISOString();
      break;
    case 'always':
      startDate = undefined;
      endDate = undefined;
      break;
    default:
      startDate = undefined;
      endDate = undefined;
      break;
  }

  return { startDate, endDate };
}

export function getDateRange(date: string) {
  const now = new Date();
  let startDate, endDate;

  switch (date) {
    case 'this-month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
      break;
    case 'this-year':
      startDate = new Date(now.getFullYear(), 0, 1).toISOString();
      endDate = new Date(now.getFullYear(), 12, 1).toISOString();
      break;
    default:
      startDate = undefined;
      endDate = undefined;
      break;
  }

  return { startDate, endDate };
}

export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
  }).format(date);
}

export async function exportToExcel<T>({ dataToExport, columns }: { dataToExport: T[]; columns: Partial<ExcelJS.Column>[] }) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  worksheet.columns = columns;

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };
  });

  dataToExport.forEach((category) => {
    worksheet.addRow(category);
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
    }
    column.width = maxLength + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, 'tabla_exportada.xlsx');
}

export async function delay(seconds: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(currency);
}
