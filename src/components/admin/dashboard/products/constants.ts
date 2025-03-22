export interface Columnas {
  [key: string]: string;
}

export const columnas: Columnas = {
  id: 'Id',
  images: 'Imagen',
  name: 'Nombre',
  stock: 'Stock',
  costPrice: 'Costo',
  salePrice: 'Venta',
};

export const dateRange = [
  { id: 1, label: 'Este mes', value: 'month' },
  { id: 2, label: 'Este año', value: 'year' },
  { id: 3, label: 'Siempre', value: 'always' },
];

export const columnsToExport = [
  { header: 'Id', key: 'id' },
  { header: 'Nombre', key: 'name' },
  { header: 'Stock', key: 'stock' },
  { header: 'Costo', key: 'costPrice' },
  { header: 'Venta', key: 'salePrice' },
];

export const PAGE_INDEX = 0;
export const PAGE_SIZE = 5;
