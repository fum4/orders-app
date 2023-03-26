import { component$ } from "@builder.io/qwik";
import OrdersList from '~/components/orders-list';

export default component$(() => {
  return (
    <div>
      <OrdersList />
    </div>
  );
})
