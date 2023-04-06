import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Form, globalAction$, useNavigate } from "@builder.io/qwik-city";
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from "firebase/auth";

import { auth } from "~/firebase";
import { logError } from "~/utils";
import Header from "~/components/header";

export const useFormSubmit = globalAction$(async({ email, password }, { fail }) => (
  signInWithEmailAndPassword(auth, email as string, password as string)
    .then(() => {
      return { success: true };
    })
    .catch((err) => {
      logError(err);

      return fail(404, {
        message: 'User not found'
      });
    })
));

export default component$(() => {
  const action = useFormSubmit();
  const goto = useNavigate();

  // useVisibleTask$(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     // TODO: observer doesn't work
  //     console.log('@@@@@ user ', user);
  //     if (user) {
  //       goto('/admin');
  //     }
  //   })
  // });

  onAuthStateChanged(getAuth(), (user) => {
    // TODO: observer doesn't work
    console.log('@@@@@ user ', user);
    if (user) {
      goto('/admin');
    }
  })

  return (
    <div class="h-full flex flex-col pt-16 pb-24 mw-96 mh-96">
      <Header />
      <h1 className='mx-auto xs:w-full md:w-96 text-3xl my-6 text-center'>
        Autentificare
      </h1>
      <Form
        class='p-5'
        action={action}
      >
        <div class='flex flex-col items-center'>
          <div class='flex flex-col max-w-xs mb-3'>
            <label
              for='email'
              className='text-gray-400 pl-2'
            >
              Email
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='email'
              type='email'
            />
          </div>
          <div className='flex flex-col max-w-xs mb-10'>
            <label
              for='password'
              className='text-gray-400 pl-2'
            >
              Parolă
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='password'
              type='password'
            />
          </div>
          <button
            className='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg py-2 px-4 h-10'
            type='submit'
          >
            Conectează-te
          </button>
        </div>
      </Form>
    </div>
  );
});
