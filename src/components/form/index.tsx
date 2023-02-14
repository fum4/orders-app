import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './header.css?inline';

interface Input {
  id: number;
  label: string;
  type: 'dropdown' | 'number';
}

const inputs: Input[] = [
  {
    id: 1,
    label: 'Denumire comandă',
    type: 'dropdown'
  },
  {
    id: 2,
    label: 'Tip eveniment',
    type: 'dropdown'
  },
  {
    id: 3,
    label: 'Cantitate',
    type: 'number'
  },
]

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <section>
      {inputs.map((input) => (
        <input {...input.props} />
      ))}
    </section>
  );
});
