import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { initializeApp } from 'firebase/app';
import { RouterHead } from './components/router-head/router-head';

import globalStyles from './global.css?inline';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  const firebaseConfig = {
    apiKey: 'AIzaSyBJeoNDsdFjEohaw8xGvQ-r9LDixT5PO24',
    authDomain: 'orders-c0424.firebaseapp.com',
    projectId: 'orders-c0424',
    storageBucket: 'orders-c0424.appspot.com',
    messagingSenderId: '786806036697',
    appId: '1:786806036697:web:d30e877a44a42dc78746c8',
    measurementId: 'G-BGK89ETBLC'
  };

  const app = initializeApp(firebaseConfig);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet='utf-8' />
        <link rel='manifest' href='/manifest.json' />
        <RouterHead />
      </head>
      <body lang='en'>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
