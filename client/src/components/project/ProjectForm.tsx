import { useMutation } from '@apollo/client';
import React, { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormField';
import { useForm } from '../../hooks/UseForm';
import { NEW_PROJECT } from '../../typedefs';
import Button from '../Button';

interface Form {
  title: string;
  description: string;
}

const ProjectForm = () => {
  const [fetch, { data, loading, error }] = useMutation(NEW_PROJECT);

  const navigate = useNavigate();

  const [handleChange, form] = useForm<Form>();

  useEffect(() => {
    if (data && data.createProject) {
      navigate('/');
    }
    console.log(data);
  }, [data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch({
      variables: {
        ...form,
      },
    });
  };

  if (error) return <span>error</span>;
  return (
    <div className="h-full flex items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded flex items-center w-[90%] mx-auto h-1/2 bg-[var(--bg-form)]"
      >
        <fieldset className="w-full">
          <legend className="pl-2 text-slate-500">New Project</legend>
          <FormField name="title" value={form.title} onChange={handleChange} />
          <FormField
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Button name="Create" type="submit" disabled={loading} />
        </fieldset>
      </form>
    </div>
  );
};

export default ProjectForm;
