import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { Form, globalAction$, server$, useNavigate } from "@builder.io/qwik-city";
import { collection, getDocs, updateDoc, query, where, doc, getDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

import Header from "~/components/header";
import { db } from "~/firebase";

export const silentSignIn = server$(async function() {
  const userId = this.cookie.get('userId')?.value;

  if (userId) {
    const userSnapshot = await getDoc(doc(db, 'users', userId));

    if (userSnapshot.exists()) {
      const { token } = userSnapshot.data();

      if (token === this.cookie.get('token')?.value) {
        return { success: true };
      }
    }
  }

  return { success: false };
});

export const useSignIn = globalAction$(async({ user, password }, { redirect, cookie, fail }) => {
  const usersSnapshot = await query(
    collection(db, 'users'),
    where('user', '==', user),
    where('password', '==', password)
  );

  const users = await getDocs(usersSnapshot);
  const dbUser = users.docs[0];

  if (dbUser) {
    const token = nanoid();

    try {
      await updateDoc(doc(db, 'users', dbUser.id), { token });

      cookie.set('token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      cookie.set('userId', dbUser.id, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      return redirect(302, '/admin');
    } catch(err) {
      console.error(err);
    }
  }

  return fail(404, {
    message: 'User not found'
  });
});

export default component$(() => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  useVisibleTask$(() => {
    (async() => {
      const { success } = await silentSignIn();

      if (success) {
        navigate(`/admin`)
      }
    })()
  });

  return (
    <div class="h-full flex flex-col pt-16 pb-24 mw-96 mh-96">
      <Header />
      <h1 class='mx-auto xs:w-full md:w-96 text-3xl my-6 text-center'>
        Autentificare
      </h1>
      <Form
        class='p-5'
        action={signIn}
      >
        <div class='flex flex-col items-center'>
          <div class='flex flex-col max-w-xs mb-3'>
            <label
              for='email'
              class='text-gray-400 pl-2'
            >
              User
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='user'
              type='text'
            />
          </div>
          <div class='flex flex-col max-w-xs mb-3'>
            <label
              for='password'
              class='text-gray-400 pl-2'
            >
              Parolă
            </label>
            <input
              class='h-10 p-2 border-0 rounded-lg'
              name='password'
              type='password'
            />
          </div>
          <div class="h-5 mb-7">
            {/*@ts-ignore*/}
            {signIn.value?.failed && (
              <p class='text-rose-500 text-center'>Oops, a apărut o problemă</p>
            )}
          </div>
          <button
            class='bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg py-2 px-4 h-10'
            type='submit'
          >
            Conectează-te
          </button>
        </div>
      </Form>
    </div>
  );
});
