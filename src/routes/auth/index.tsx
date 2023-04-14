import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Form, globalAction$, useNavigate } from "@builder.io/qwik-city";
import Header from "~/components/header";

export const useFormSubmit = globalAction$(async({ email, password }, { fail }) => {
  if (email === import.meta.env.USER_NAME && password === import.meta.env.USER_PASS) {
    return { success: true };
  }

  return fail(404, {
    message: 'User not found'
  });
});

export default component$(() => {
  const action = useFormSubmit();
  const navigate = useNavigate();

  useVisibleTask$(({ track }) => {
    // track(() => action.value?.success);
    //
    // console.log('@@@@@', action.value)
    //
    // if (action.value?.success) {
      navigate('/admin');
    // }
  });

  return (
    <div class="h-full flex flex-col pt-16 pb-24 mw-96 mh-96">
      <Header />
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl my-6 text-center'>
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
              class='text-gray-400 pl-2'
            >
              Email
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='email'
              type='email'
            />
          </div>
          <div class='flex flex-col max-w-xs mb-10'>
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
