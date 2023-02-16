import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

type HTMLElements = HTMLInputElement;

export const useForm = <T extends Object>() => {
  const [form, setForm] = useState<T>({} as T);
  const defaultValueRef = useRef<HTMLElements>(null);

  useEffect(() => {
    if (defaultValueRef.current) {
      const { defaultValue, name } = defaultValueRef.current;
      setForm({
        ...form,
        [name]: defaultValue,
      });
    }
  }, []);

  const handleChange = ({ target }: ChangeEvent<HTMLElements>) => {
    const { name, value } = target;
    console.log({ name, value });
    setForm({
      ...form,
      [name]: value,
    });
  };

  return [handleChange, form, defaultValueRef, setForm] as const;
};
