import { component$, useStore, $ } from '@builder.io/qwik';
import { z } from 'zod';

const Input = z.object({
  id: z.enum([ 'deliveryDate', 'deliveryTime', 'deliveryType', 'details', 'eventType', 'name', 'phoneNumber', 'productName', 'qty' ]),
  label: z.string(),
  type: z.enum([ 'dropdown', 'number', 'string', 'date' ]),
  options: z.array(z.string()).optional(),
});

type Input = z.infer<typeof Input>;

export const inputs: Input[] = [
  {
    id: 'productName',
    label: 'Denumire comandă',
    type: 'dropdown',
    options: [ 'banana cake', 'red velvet', 'rahat turcesc' ],
  },
  {
    id: 'eventType',
    label: 'Tip eveniment',
    type: 'dropdown',
    options: [ 'Zi de naștere', 'Nuntă', 'Botez', 'Alt eveniment' ],
  },
  {
    id: 'qty',
    label: 'Cantitate',
    type: 'number',
  },
  {
    id: 'deliveryDate',
    label: 'Dată livrare',
    type: 'date',
  },
  {
    id: 'deliveryTime',
    label: 'Oră livrare',
    type: 'string',
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
  },
  {
    id: 'phoneNumber',
    label: 'Număr de telefon',
    type: 'number',
  },
  {
    id: 'details',
    label: 'Detalii comandă',
    type: 'string',
  },
];

export default component$(() => {
  const store = useStore({
    displaySuccessMessage: false,
  });

  const inputClass = 'h-10 w-full border-2 border-sky-100 rounded-lg px-2';

  const handleSubmit = $((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev);
  });

  return (
    <section class='px-5'>
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl py-10'>
        Comandă nouă
      </h1>
      <form
        onSubmit$={handleSubmit}
        class='grid grid-cols-1 gap-4 xs:w-full md:w-96 mx-auto'
      >
        {inputs.map((input) => (
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
                  name={input.label}
                  class={inputClass}
                >
                  <option key='default' value='default'>
                    Selectați o valoare
                  </option>
                  {input.options?.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </span>
            )}
            {['number', 'string', 'date'].includes(input.type) && (
              <span>
                <label
                  for={input.label}
                  class='text-gray-400 pl-2'
                >
                  {input.label}
                </label>
                <input
                  name={input.label}
                  type={input.type}
                  class={inputClass}
                />
              </span>
           )}
          </span>
        ))}
        <button
          type='submit'
          class='bg-sky-400 hover:bg-sky-600 active:bg-sky-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-10'
        >
          Trimite comanda
        </button>
      </form>
      {store.displaySuccessMessage && (
        <p>Comanda a fost trimisă cu succes! Veți fi contactat în scurt timp pentru confirmare.</p>
      )}
    </section>
  );
});
