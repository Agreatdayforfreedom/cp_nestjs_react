import React, { ChangeEvent, useState } from 'react';

type HTMLElements = HTMLInputElement | HTMLTextAreaElement;

export const useForm = <T extends Object>() => {
  const [form, setForm] = useState<T>({} as T);

  const handleChange = ({ target }: ChangeEvent<HTMLElements>) => {
    const { name, value } = target;

    setForm({ ...form, [name]: value });
  };

  return [handleChange, form, setForm] as const;
};
