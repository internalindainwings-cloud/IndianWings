export type Brand = {
  id: string;
  name: string;
  /** If undefined, renders a text-badge pill using brand name in Playfair Display */
  logoSrc?: string;
  altText: string;
  typeLabel: string;
};

export const partners: Brand[] = [
  { id: 'golden-leaf', name: 'Golden Leaf', altText: 'Golden Leaf', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'sarovar-portico', name: 'Sarovar Portico', altText: 'Sarovar Portico', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'tak-lake-view', name: 'Tak Lake View', altText: 'Tak Lake View', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'the-lalit', name: 'The Lalit', altText: 'The Lalit', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'the-deewan', name: 'The Deewan', altText: 'The Deewan', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'khyber', name: 'Khyber', altText: 'Khyber', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'radisson', name: 'Radisson', altText: 'Radisson', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'lemon-tree', name: 'Lemon Tree', altText: 'Lemon Tree', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'arco-resort', name: 'Arco Resort', altText: 'Arco Resort', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'four-point-sheraton', name: 'Four Points by Sheraton', altText: 'Four Points by Sheraton', typeLabel: 'HOSPITALITY PARTNER' },
  { id: 'ramada-encore', name: 'Ramada Encore', altText: 'Ramada Encore', typeLabel: 'HOSPITALITY PARTNER' },
];
