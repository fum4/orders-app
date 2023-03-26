import { component$ } from "@builder.io/qwik";

import OrdersList from '~/components/orders-list';
import { auth } from '~/firebase';

export default component$(() => {
  console.log('@@@@ current user ', auth.currentUser)
  auth.signOut()
  return (
    <div>
      {auth.currentUser ? (
        <OrdersList />
      ) : (
        <p>Not authorized</p>
      )}
    </div>
  );
})
