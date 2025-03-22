export interface Columnas {
  [key: string]: string;
}

export const columnas: Columnas = {
  name: 'Nombre',
  type: 'Tipo',
  document: 'Número',
};

export const dateRange = [
  { id: 1, label: 'Este mes', value: 'month' },
  { id: 2, label: 'Este año', value: 'year' },
  { id: 3, label: 'Siempre', value: 'always' },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'Tipo', key: 'type' },
  { header: 'Número', key: 'document' },
];

export const PAGE_INDEX = 0;
export const PAGE_SIZE = 5;
