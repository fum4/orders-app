import { component$ } from "@builder.io/qwik";
import Form from '~/components/form';

export default component$(() => {
  // Data can be consumed during SSR and SPA!!
  // Rendering data using signals
  // no need for async and await - Qwik handles it for you!
  return (
    <div>
      <Form />
    </div>
  );
})
