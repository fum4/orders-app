import { component$ } from '@builder.io/qwik';

export default component$(() => (
  <header class='flex justify-center'>
    <div>
      <a href="https://simturi.com" target="_blank" title="Simțuri">
        <img
          src='/logo.webp'
          alt='Simțuri logo'
          width='200px'
        />
      </a>
    </div>
  </header>
));
