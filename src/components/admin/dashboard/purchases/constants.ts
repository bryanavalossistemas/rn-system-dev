export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  documentNumber: 'N° Documento',
  createdAt: 'Fecha',
  supplierName: 'Proveedor',
  supplierDocument: 'RUC / DNI',
  total: 'Total',
};

export const dateOptions = [
  { id: 1, label: 'Este mes', value: 'this-month' },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: null },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Número', key: 'documentNumber' },
  { header: 'Proveedor', key: 'supplierName' },
  { header: 'RUC / DNI', key: 'supplierDocument' },
  { header: 'Total', key: 'total' },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
