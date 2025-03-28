export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  document_documentNumber: 'N° Documento',
  createdAt: 'Fecha',
  supplierName: 'Proveedor',
  supplierDocument: 'RUC / DNI',
  document_total: 'Total',
};

export const dateOptions = [
  { id: 1, label: 'Este mes', value: 'this-month' },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: null },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'Tipo', key: 'type' },
  { header: 'Número', key: 'document' },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
