import { $, component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import { collection, doc, getDocs, query, where, getDoc } from "firebase/firestore";

import OrdersList from "~/components/orders-list";
import { db } from "~/firebase";

export const useOrders = routeLoader$((requestEvent) => {
  // (async() => {
  //   // const userId = requestEvent.cookie.get('userId')?.value;
  //   //
  //   // if (userId) {
  //   //   const userSnapshot = await getDoc(doc(db, 'users', userId));
  //   //
  //   //   if (userSnapshot.exists()) {
  //   //     const { token } = userSnapshot.data();
  //   //
  //   //     if (requestEvent.cookie.get('token')?.value === token) {
  //   //       const ordersSnapshot = await query(
  //   //         collection(db, 'orders'),
  //   //         where('completed', '==', false)
  //   //       );
  //   //       const ordersDocs = await getDocs(ordersSnapshot);
  //   //
  //   //       return ordersDocs.docs.map((doc) => ({
  //   //         id: doc.id,
  //   //         data: doc.data()
  //   //       }))
  //   //     }
  //   //   }
  //   // }
  //   //
  //   // return requestEvent.redirect(302, '/auth');
  //   return;
  // })()

  return {};
});

const useSignOut = routeAction$((_, { cookie, redirect }) => {
  if (cookie.get('token')) {
    cookie.delete('token', { path: '/' });
  }

  if (cookie.get('userId')) {
    cookie.delete('userId', { path: '/' });
  }

  redirect(301, '/');
});

export default component$(() => {
  const signOut = useSignOut();
  const orders = useOrders();

  const handleSignOut = $(() => {
    signOut.submit();
  });

  return (
    <>
      <div class='flex justify-between m-4'>
        {/*<label class="relative inline-flex items-center cursor-pointer">*/}
        {/*  <input type="checkbox" value={showCompletedOrders.value} class="sr-only peer" />*/}
        {/*  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />*/}
        {/*  <span class="ml-3 text-sm text-gray-500">Afișează comenzile inactive</span>*/}
        {/*</label>*/}
        <button
          class='border-dashed border border-rose-600 active:border-rose-700 hover:bg-rose-600 active:bg-rose-700 text-rose-600 hover:text-white active:text-white rounded-lg px-4 h-7'
          onClick$={handleSignOut}
        >
          Deconectează-te
        </button>
      </div>
      {/*<OrdersList orders={orders} />*/}
    </>
  );
})
