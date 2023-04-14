import { $, component$, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { getAuth, signOut } from "firebase/auth";

import OrdersList from '~/components/orders-list';
import { auth } from '~/firebase';
import { useNavigate } from "@builder.io/qwik-city";
import { logError } from "~/utils";

export default component$(() => {
  const navigate = useNavigate();
  const showCompletedOrders = useSignal<boolean>(false);

  const handleSignOut = $(async() => {
    try {
      await signOut(auth);
    } catch (er) {
      logError(err);
    }

    navigate('/');
  });

  useTask$(() => {
    // const auth = getAuth();
console.log('@@@@ currentUser', auth.currentUser)
    if (!auth.currentUser) {
      navigate('/auth');
    }
  });

  useVisibleTask$(() => {
    // const auth = getAuth();
    console.log('@@@@ currentUser', auth.currentUser)
    if (!auth.currentUser) {
      navigate('/auth');
    }
  });

  return (
    <>
      <div class='flex justify-between m-4'>
        {/*<label className="relative inline-flex items-center cursor-pointer">*/}
        {/*  <input type="checkbox" value={showCompletedOrders.value} className="sr-only peer" />*/}
        {/*  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />*/}
        {/*  <span className="ml-3 text-sm text-gray-500">Afișează comenzile inactive</span>*/}
        {/*</label>*/}
        <button
          class='border-dashed border border-rose-600 active:border-rose-700 hover:bg-rose-600 active:bg-rose-700 text-rose-600 hover:text-white active:text-white rounded-lg px-4 h-7'
          onClick$={handleSignOut}
        >
          Deconectează-te
        </button>
      </div>
      <OrdersList showCompleted={showCompletedOrders.value} />
    </>
  );
})
