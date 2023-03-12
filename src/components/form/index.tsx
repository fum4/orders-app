import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { globalAction$, Form, zod$, z } from '@builder.io/qwik-city';
import { collection, addDoc, getCountFromServer } from 'firebase/firestore';
import nodemailer from 'nodemailer';

import { db } from '~/firebase'
import { logError, logMessage } from "~/utils";

const getFieldById = (id: string) => fields.find((input) => input.id === id) as Field;
const getFieldOptionsById = (id: string) => getFieldById(id)?.options as string[];
const getFieldLabelById = (id: string) => getFieldById(id)?.label as string;

const FieldId = z.enum([ 'deliveryDate', 'deliveryTime', 'deliveryType', 'details', 'eventType', 'name', 'phoneNumber', 'productName', 'qty' ]);
const FieldType = z.enum([ 'dropdown', 'number', 'string', 'date', 'time', 'textarea' ]);

const Field = z.object({
  id: FieldId,
  type: FieldType,
  label: z.string(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

type Field = z.infer<typeof Field>;
type FieldId = z.infer<typeof FieldId>;
type FieldType = z.infer<typeof FieldType>;

export const fields: Field[] = [
  {
    id: 'productName',
    label: 'Denumire comandă',
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

const validationSchema = zod$({
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
})

export const useFormSubmit = globalAction$(async(data) => {
  try {
    const orders = collection(db, 'orders');
    await addDoc(orders, data);
    const snapshot = await getCountFromServer(orders);
    const orderNo = snapshot.data().count;

    const mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.VITE_MAIL_SENDER,
        pass: import.meta.env.VITE_MAIL_PASSWORD
      }
    });

    const body = `
      <table>
        <tr>
          <th>Comanda #${orderNo}</th>
        </tr>
        ${Object.entries(data).reduce((acc, [ key, value ]) => (
          `
            ${acc}
            <tr>
              <td>${getFieldLabelById(key)}</td>
              <td>${value}</td>
            </tr>
          `
        ), '')}
      </table>
    `;

    const mailDetails = {
      from: import.meta.env.VITE_MAIL_SENDER,
      to: import.meta.env.VITE_MAIL_RECEIVER,
      subject: `Comanda nr. ${orderNo}`,
      html: body
    };

    mailTransporter.sendMail(mailDetails, function(err) {
      if (err) {
        logError('Email send failed', err);
      } else {
        logMessage('Email sent successfully');
      }
    });

    return { success: true };
  } catch(err) {
    logError(err);
    return { failed: true };
  }
}, validationSchema);

export default component$(() => {
  const action = useFormSubmit();
  const touched = useSignal<FieldId[]>([]);
  const inputBaseClass = `h-10 w-full border-2 rounded-lg px-2`;
  const inputDefaultClass = `${inputBaseClass} border-sky-100`;
  const inputErrorClass = `${inputBaseClass} border-rose-500`;

  const isError = (key: FieldId) => action.value?.fieldErrors && Object.keys(action.value.fieldErrors).includes(key);
  const isTouched = (key: FieldId) => touched.value.includes(key);

  const touch = $((key: FieldId) => touched.value = [ ...touched.value, key ]);

  useVisibleTask$(({ track }) => {
    track(() => action.value?.fieldErrors);
    touched.value = [];
  });

  return (
    <section class='px-5'>
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl pb-10'>
        Comandă nouă
      </h1>
      <Form
        class='grid grid-cols-1 gap-4 xs:w-full md:w-96 mx-auto'
        action={action}
      >
        {fields.map((input) => (
          <span>
            {['dropdown'].includes(input.type) && (
              <span>
                <label
                  for={input.label}
                  class='text-gray-400 pl-2'
                >
                  {input.label}
                </label>
                <select
                  name={input.id}
                  class={!isTouched(input.id) && isError(input.id) ? inputErrorClass : inputDefaultClass}
                  onChange$={() => touch(input.id)}
                >
                  <option key='default' value='default'>
                    Selectați o valoare
                  </option>
                  {input.options?.map((label, index) => (
                    <option
                      key={index}
                      value={label}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </span>
            )}
            {['textarea' ].includes(input.type) && (
              <span>
                <label
                  for={input.id}
                  class='text-gray-400 pl-2'
                >
                  {input.label}
                </label>
                <textarea
                  name={input.id}
                  placeholder={input.placeholder}
                  class={`${!isTouched(input.id) && isError(input.id) ? inputErrorClass : inputDefaultClass} h-24`}
                  onChange$={() => touch(input.id)}
                />
              </span>
            )}
            {['number', 'string', 'date', 'time' ].includes(input.type) && (
              <span>
                <label
                  for={input.id}
                  class='text-gray-400 pl-2'
                >
                  {input.label}
                </label>
                <input
                  name={input.id}
                  type={input.type}
                  placeholder={input.placeholder}
                  class={!isTouched(input.id) && isError(input.id) ? inputErrorClass : inputDefaultClass}
                  onChange$={() => touch(input.id)}
                />
              </span>
           )}
          </span>
        ))}
        {/*<p className='text-gray-400 text-center'>Câmpurile marcate cu * sunt obligatorii.</p>*/}
        <button
          class='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-10'
          type='submit'
        >
          Trimite comanda
        </button>
      </Form>
      {action.value?.success && (
        <>
          <p class='text-green-600 text-center'>Comanda a fost trimisă cu succes!</p>
          <p class='text-green-600 text-center'>Veți fi contactat în scurt timp pentru confirmare.</p>
        </>
      )}
      {action.value?.failed && (
        <p class='text-rose-500 text-center'>A avut loc o problemă cu procesarea comenzii.</p>
      )}
    </section>
  );
});
