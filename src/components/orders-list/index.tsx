import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';

import { db } from '~/firebase'
import { getFieldLabelById } from '~/fields';

interface Props {
  showCompleted: boolean;
}

export default component$(({ showCompleted }: Props) => {
  const orders = useSignal<any>([]);
  const isCompletingOrder = useSignal<boolean>(false);

  useTask$(async(/* { track } */) => {
    // track((showCompleted) => showCompleted);

    const ordersSnapshot = await query(
      collection(db, 'orders'),
      where('completed', '==', showCompleted)
    );
    const ordersDocs = await getDocs(ordersSnapshot);

    orders.value = ordersDocs.docs.map((doc) => ({
      id: doc.id,
      data: doc.data()
    }))
  });

  const completeOrder = $(async(id: string) => {
    if (isCompletingOrder.value) {
      try {
        await updateDoc(doc(db, 'orders', id), {
          completed: true,
        });

        orders.value = orders.value.filter((order: any) => order.id !== id);

        isCompletingOrder.value = false;
      } catch(err) {
        console.error(err);
      }
    } else {
      isCompletingOrder.value = true;

      setTimeout(() => {
        if (isCompletingOrder.value) {
          isCompletingOrder.value = false;
        }
      }, 2000);
    }
  });

  return (
    <section class='px-5 py-20'>
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl pb-10'>
        Ultimele comenzi
      </h1>
      <div class='grid grid-cols-1 gap-20 xs:w-full md:w-96 mx-auto'>
        {orders.value.map((order: any) => (
          <div class='flex flex-col items-center'>
            <table class='mx-auto'>
              <tbody>
                {Object.entries(order.data)
                  .filter(([ key ]) => !['completed'].includes(key))
                  .map(([ key, value ]) => (
                    <tr class='odd:bg-purple-50 odd:bg-opacity-50'>
                      <td class='w-40 p-2 border border-purple-200'>{getFieldLabelById(key)}</td>
                      {key === 'phoneNumber' ? (
                        <td class='border border-purple-200'>
                          {/* @ts-ignore */}
                          <a class='mt-2 p-2 mb-8 text-purple-600' href={`tel:${value}`}>{value}</a>
                        </td>
                      ) : (
                        <td class='p-2 break-all border border-purple-200'>
                          {/* @ts-ignore */}
                          {value}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              class={`bg-${isCompletingOrder.value ? 'rose' : 'purple'}-500 hover:bg-${isCompletingOrder.value ? 'rose' : 'purple'}-600 active:bg-${isCompletingOrder.value ? 'rose' : 'purple'}-700 text-white rounded-lg w-1/2 mx-auto mt-6 mb-10 h-8`}
              onClick$={() => completeOrder(order.id)}
            >
              {isCompletingOrder.value ? 'Ești sigur?' : 'Finalizează'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});
