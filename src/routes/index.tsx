import { $, component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Form from '~/components/form';
import Header from "~/components/header";
import { useAuthSession, useAuthSignin } from "~/routes/plugin@auth";

export default component$(() => {
  const navigate = useNavigate();
  const session = useAuthSession();
  const signIn = useAuthSignin();
  const isAuthenticated = !!session.value?.user;

  console.log('@@@@@ isAuthenticated', isAuthenticated)

  const handleLogin = $(() => {
    console.log('@@@@@ isAuthenticated', isAuthenticated)
    const redirectUrl = '/admin';

    if (isAuthenticated) {
      navigate(redirectUrl);
    } else {
      signIn.submit({ providerId: 'google', options: { callbackUrl: redirectUrl } });
    }
  })

  return (
    <div class='pb-6'>
      <Header />
      <Form />
      <div class='flex justify-center mb-6'>
        <button
          class='border-dashed border border-purple-600 active:border-purple-700 hover:bg-purple-600 active:bg-purple-700 text-purple-600 hover:text-white active:text-white rounded-lg px-4 h-7 mt-4'
          onClick$={handleLogin}
        >
          {isAuthenticated ? 'Mergi la comenzi' : 'Autentificare'}
        </button>
      </div>
    </div>
  );
})
