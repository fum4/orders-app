import { type QwikMouseEvent, $, component$ } from "@builder.io/qwik";

import Header from "~/components/header";

export default component$(() => {
  const handleLogin = $((ev: QwikMouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.warn('Alpha testing only', ev);
  });

  return (
    <div class="h-full flex flex-col pt-16 pb-24 mw-96 mh-96">
      <Header />
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl my-6 text-center'>
        Autentificare
      </h1>
     <button onClick$={handleLogin}>Login</button>
    </div>
  );
});
