export interface Columns {
  [key: string]: string;
}

export const columns: Columns = {
  name: 'Nombre',
  type: 'RUC/DNI',
  document: 'N° Documento',
};

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'RUC/DNI', key: 'type' },
  { header: 'N° Documento', key: 'document' },
];

export const dateOptions = [
  { id: 1, label: 'Este mes', value: 'this-month' },
  { id: 2, label: 'Este año', value: 'this-year' },
  { id: 3, label: 'Siempre', value: null },
];

export const pageSize = window.innerWidth < 640 ? 3 : 5;
