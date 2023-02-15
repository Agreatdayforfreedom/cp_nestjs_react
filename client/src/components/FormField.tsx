import React, { ChangeEventHandler } from 'react';
import { useForm } from '../hooks/UseForm';
import { capitalize } from '../utils/capitalize';

interface Props<T> {
  name: Lowercase<string>;
  value?: T;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  className?: string;
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
        className={`${className} input bg-transparent border-b border-slate-700`}
        autoComplete="off"
        onChange={onChange}
      />
    </div>
  );
};

export default FormField;
