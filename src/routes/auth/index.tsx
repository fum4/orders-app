import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Form, globalAction$, useNavigate } from "@builder.io/qwik-city";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { auth } from "~/firebase";
import { logError } from "~/utils";

export const useFormSubmit = globalAction$(async({ email, password }, { fail }) => (
  signInWithEmailAndPassword(auth, email, password)
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

  useVisibleTask$(() => {
    onAuthStateChanged(auth, (user) => {
      // TODO: observer doesn't work
      console.log('@@@@@ user ', user);
      if (user) {
        goto('/admin');
      }
    })
  });

  return (
    <Form action={action}>
      <label
        for='email'
        className='text-gray-400 pl-2'
      >
        Email
      </label>
      <input
        name='email'
        type='email'
      />
      <label
        for='password'
        className='text-gray-400 pl-2'
      >
        Email
      </label>
      <input
        name='password'
        type='password'
      />
      <button type='submit'>
        Conectează-te
      </button>
    </Form>
  );
});
