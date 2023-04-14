import { component$ } from "@builder.io/qwik";
import { Form, globalAction$ } from "@builder.io/qwik-city";

import Header from "~/components/header";

export const useSignIn = globalAction$(({ user, password }, { redirect, cookie, fail }) => {
  if (user === import.meta.env.VITE_USER_NAME && password === import.meta.env.VITE_USER_PASS) {
    cookie.set('authenticated', 'true', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    redirect(302, '/admin');

    return { success: true };
  }

  return fail(404, {
    message: 'User not found'
  });
});

export default component$(() => {
  const signIn = useSignIn();

  return (
    <div class="h-full flex flex-col pt-16 pb-24 mw-96 mh-96">
      <Header />
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl my-6 text-center'>
        Autentificare
      </h1>
      <Form
        class='p-5'
        action={signIn}
      >
        <div class='flex flex-col items-center'>
          <div class='flex flex-col max-w-xs mb-3'>
            <label
              for='email'
              class='text-gray-400 pl-2'
            >
              User
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='user'
              type='text'
            />
          </div>
          <div class='flex flex-col max-w-xs mb-3'>
            <label
              for='password'
              class='text-gray-400 pl-2'
            >
              Parolă
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='password'
              type='password'
            />
          </div>
          <div class="h-5 mb-7">
            {signIn.value?.failed && (
              <p class='text-rose-500 text-center'>Oops, a apărut o problemă</p>
            )}
          </div>
          <button
            class='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg py-2 px-4 h-10'
            type='submit'
          >
            Conectează-te
          </button>
        </div>
      </Form>
    </div>
  );
});
