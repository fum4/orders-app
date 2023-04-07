import { $, component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Form from '~/components/form';
import Header from "~/components/header";

export default component$(() => {
  const goto = useNavigate();

  const handleSignIn = $(() => {
    goto('/auth');
  });

  return (
    <div class='pb-6'>
      <Header />
      <Form />
      <div class='flex justify-center mb-6'>
        <button
          class='border-dashed border border-purple-600 active:border-purple-700 hover:bg-purple-600 active:bg-purple-700 text-purple-600 hover:text-white active:text-white rounded-lg px-4 h-7 mt-4'
          onClick$={handleSignIn}
        >
          Autentificare
        </button>
      </div>
    </div>
  );
})
