import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';

import { db } from '~/firebase'
import { getFieldLabelById } from '~/fields';

export default component$(() => {
  const orders = useSignal<any>([]);

  useTask$(async() => {
    const ordersSnapshot = await query(collection(db, 'orders'), where('completed', '==', false));
    const ordersDocs = await getDocs(ordersSnapshot);

    orders.value = ordersDocs.docs.map((doc) => ({
      id: doc.id,
      data: doc.data()
    }))
  });

  const completeOrder = $(async(id: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        completed: true,
      });

      orders.value = orders.value.filter((order) => order.id !== id);
    } catch(err) {
      console.error(err);
    }
  });

  return (
    <section class='px-5'>
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl pb-10'>
        Ultimele comenzi
      </h1>
      <div class='grid grid-cols-1 gap-20 xs:w-full md:w-96 mx-auto'>
        {orders.value.map((order: any) => (
          <div>
            {Object.entries(order.data).map(([ key, value ]) => (
              <div class='grid grid-cols-2'>
                <div class='w-40 py-2'>{getFieldLabelById(key)}</div>
                <div class='py-2 break-all'>{value}</div>
              </div>
            ))}
            <button
              class='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-10'
              onClick$={() => completeOrder(order.id)}
            >
              Finalizează comanda
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});
