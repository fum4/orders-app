import { z, zod$ } from "@builder.io/qwik-city";

export const getFieldById = (id: string) => fields.find((input) => input.id === id) as Field;
export const getFieldOptionsById = (id: string) => getFieldById(id)?.options as string[];
export const getFieldLabelById = (id: string) => getFieldById(id)?.label as string;

const FieldId = z.enum([ 'deliveryDate', 'deliveryTime', 'deliveryType', 'details', 'eventType', 'name', 'phoneNumber', 'productName', 'qty' ]);
const FieldType = z.enum([ 'dropdown', 'number', 'string', 'date', 'time', 'textarea' ]);

const Field = z.object({
  id: FieldId,
  type: FieldType,
  label: z.string(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export type Field = z.infer<typeof Field>;
export type FieldId = z.infer<typeof FieldId>;
export type FieldType = z.infer<typeof FieldType>;

export const fields: Field[] = [
  {
    id: 'productName',
    label: 'Produs',
    type: 'dropdown',
    options: ['banana cake', 'red velvet', 'rahat turcesc'],
  },
  {
    id: 'eventType',
    label: 'Tip eveniment',
    type: 'dropdown',
    options: ['Zi de naștere', 'Nuntă', 'Botez', 'Alt eveniment'],
  },
  {
    id: 'qty',
    label: 'Cantitate (kg)',
    type: 'string',
    placeholder: 'ex: 2',
  },
  {
    id: 'deliveryDate',
    label: 'Dată livrare',
    type: 'date',
  },
  {
    id: 'deliveryTime',
    label: 'Oră livrare',
    type: 'time',
  },
  {
    id: 'deliveryType',
    label: 'Mod livrare',
    type: 'dropdown',
    options: [ 'Livrare', 'Ridicare' ],
  },
  {
    id: 'name',
    label: 'Nume',
    type: 'string',
    placeholder: 'Numele dvs.'
  },
  {
    id: 'phoneNumber',
    label: 'Număr de telefon',
    type: 'string',
    placeholder: '07xx xxx xxx'
  },
  {
    id: 'details',
    label: 'Detalii comandă (opțional)',
    type: 'textarea',
  },
];

export const validationSchema = zod$({
  // @ts-ignore
  productName: z.enum(getFieldOptionsById('productName')),
  // @ts-ignore
  eventType: z.enum(getFieldOptionsById('eventType')),
  qty: z.string().min(1),
  deliveryDate: z.string().length(10),
  deliveryTime: z.string().length(5),
  // @ts-ignore
  deliveryType: z.enum(getFieldOptionsById('deliveryType')),
  name: z.string().min(3),
  phoneNumber: z.string().min(10),
  details: z.string(),
});
