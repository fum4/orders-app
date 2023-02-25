import { component$ } from "@builder.io/qwik";
import { action$, Form } from '@builder.io/qwik-city';
// import nodemailer from 'node-mailer';
// import { z } from 'zod';

// const Input = z.object({
//   id: z.enum([ 'deliveryDate', 'deliveryTime', 'deliveryType', 'details', 'eventType', 'name', 'phoneNumber', 'productName', 'qty' ]),
//   label: z.string(),
//   type: z.enum([ 'dropdown', 'number', 'string', 'date' ]),
//   options: z.array(z.string()).optional(),
// });
//
// type Input = z.infer<typeof Input>;

export const inputs/*: Input[]**/ = [
  {
    id: 'productName',
    label: 'Denumire comandă',
    type: 'dropdown',
    options: [{
      id: 1,
      label: 'banana cake'
    }, {
      id: 2,
      labe: 'red velvet',
    }, {
      id: 3,
      label: 'rahat turcesc'
    } ],
  },
  {
    id: 'eventType',
    label: 'Tip eveniment',
    type: 'dropdown',
    options: [{
      id: 1,
      label: 'Zi de naștere'
    }, {
      id: 2,
      label: 'Nuntă'
    }, {
      id: 3,
      label: 'Botez'
    }, {
      id: 4,
      label: 'Alt eveniment'
    }],
  },
  {
    id: 'qty',
    label: 'Cantitate',
    type: 'string',
  },
  // {
  //   id: 'deliveryDate',
  //   label: 'Dată livrare',
  //   type: 'date',
  // },
  {
    id: 'deliveryTime',
    label: 'Oră livrare',
    type: 'string',
  },
  {
    id: 'deliveryType',
    label: 'Mod livrare',
    type: 'dropdown',
    options: [
      {
        id: 1,
        label: 'Livrare'
      },
      {
        id: 2,
        label: 'Ridicare'
      } ],
  },
  {
    id: 'name',
    label: 'Nume',
    type: 'string',
  },
  {
    id: 'phoneNumber',
    label: 'Număr de telefon',
    type: 'string',
  },
  {
    id: 'details',
    label: 'Detalii comandă',
    type: 'string',
  },
];

export const useFormSubmit = action$(async(/*data**/) => {
  // console.log('@@@ data', data);
  // // ev?.preventDefault();
  // // ev?.stopPropagation();
  // const testAccount = await nodemailer.createTestAccount();
  //
  // // create reusable transporter object using the default SMTP transport
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });
  //
  // // send mail with defined transport object
  // const info = await transporter.sendMail({
  //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //   to: "andronache.alex22@gmail.com", // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: "<b>Hello world?</b>", // html body
  // });
  //
  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  //
  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return { success: true };
});

export default component$(() => {
  const inputClass = 'h-10 w-full border-2 border-sky-100 rounded-lg px-2';
  const action = useFormSubmit();

  return (
    <section class='px-5'>
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl py-10'>
        Comandă nouă
      </h1>
      <Form
        class='grid grid-cols-1 gap-4 xs:w-full md:w-96 mx-auto'
        action={action}
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
                  name={input.id}
                  class={inputClass}
                >
                  <option key='default' value='default'>
                    Selectați o valoare
                  </option>
                  {input.options?.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </span>
            )}
            {['number', 'string', 'date'].includes(input.type) && (
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
                  class={inputClass}
                />
              </span>
           )}
          </span>
        ))}
        <button
          className='bg-sky-400 hover:bg-sky-600 active:bg-sky-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-10'
          type='submit'
        >
          Trimite comanda
        </button>
      </Form>
      {action.value?.success && (
        <p>Comanda a fost trimisă cu succes! Veți fi contactat în scurt timp pentru confirmare.</p>
      )}
    </section>
  );
});
