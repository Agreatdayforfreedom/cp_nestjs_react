import React, { ChangeEventHandler } from 'react';
import { useForm } from '../hooks/UseForm';

interface Props<T> {
  name: string;
  value?: T;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase().concat(word.slice(1));
}

const FormField = <T extends string | number>({
  name,
  value = '' as T,
  onChange = undefined,
  type = 'text',
  className = '',
}: Props<T>) => {
  return (
    <div className="bg-transparent p-2 flex flex-col px-10 my-2">
      <label htmlFor={name} className={`underline ${className}`}>
        {capitalize(name)}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        className={`${className} bg-transparent border-b border-slate-700`}
        autoComplete="off"
        onChange={onChange}
      />
    </div>
  );
};

export default FormField;
