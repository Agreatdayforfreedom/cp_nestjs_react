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

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLElements | HTMLTextAreaElement>) => {
    const { name, value } = target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return [handleChange, form, defaultValueRef, setForm] as const;
};
