import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { globalAction$, Form } from '@builder.io/qwik-city';
import { collection, addDoc } from 'firebase/firestore';

import { db } from '~/firebase'
import { logError } from "~/utils";
import { validationSchema, fields, type FieldId } from "~/fields";

export const useFormSubmit = globalAction$(async(data) => {
  try {
    const orders = collection(db, 'orders');
    await addDoc(orders, {
      ...data,
      completed: false,
    });

    // const snapshot = await getCountFromServer(orders);
    // const orderNo = snapshot.data().count;

    // const mailDetails = {
    //   from: import.meta.env.VITE_MAIL_SENDER,
    //   to: import.meta.env.VITE_MAIL_RECEIVER,
    //   subject: `Comanda nr. ${orderNo}`,
    //   html: `
    //     <table>
    //       <tr>
    //         <th>Comanda #${orderNo}</th>
    //       </tr>
    //       ${Object.entries(data).reduce((acc, [key, value]) => (
    //         `
    //           ${acc}
    //           <tr>
    //             <td>${getFieldLabelById(key)}</td>
    //             <td>${value}</td>
    //           </tr>
    //         `
    //       ), '')}
    //     </table>
    //   `
    // };
    //
    // await fetch(import.meta.env.VITE_SEND_EMAIL_ENDPOINT, {
    //   method: 'POST',
    //   body: JSON.stringify(mailDetails)
    // });

    return { success: true };
  } catch (err) {
    logError(err);
    return { failed: true };
  }
}, validationSchema);

export default component$(() => {
  const action = useFormSubmit();
  const touched = useSignal<FieldId[]>([]);
  const inputBaseClass = `h-10 w-full border-dashed border-2 rounded-lg px-2`;
  const inputDefaultClass = `${inputBaseClass} border-purple-300`;
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
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl mb-12'>
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
        <div className="h-10">
          {action.value?.failed && (
              <p class='text-rose-500 text-center'>Oops, a apărut o problemă</p>
          )}
          {action.value?.success && (
            <>
              <p class='text-green-600 text-center'>Comanda a fost trimisă cu succes!</p>
              <p class='text-green-600 text-center'>Vă vom contacta în scurt timp.</p>
            </>
          )}
        </div>
        <button
          className='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-10'
          type='submit'
        >
          Trimite comanda
        </button>
        <div class='flex flex-col items-center'>
          <p>sau</p>
          <a class='mt-2 mb-8 text-purple-600' href="tel:+40756600176">+40 756 600 176</a>
        </div>
      </Form>
    </section>
  );
});
