import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import Form from '~/components/form';

export default component$(() => {
  return (
    <div>
      <Form />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Simțuri',
  meta: [
    {
      name: 'description',
      content: 'Cofetăria Simțuri',
    },
  ],
};
