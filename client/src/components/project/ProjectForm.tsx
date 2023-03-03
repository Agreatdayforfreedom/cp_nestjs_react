import { useMutation } from '@apollo/client';
import React, { FormEvent, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
      navigate(`/project/${data.createProject.id}/dashboard`);
    }
  }, [data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch({
      variables: {
        ...form,
      },
    });
  };

  if (error)
    return (
      <span>
        <Navigate to="/" />
      </span>
    );
  return (
    <div className="h-full flex items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded flex items-center w-[90%] h-auto mx-auto bg-[var(--bg-form)]"
      >
        <fieldset className="w-full">
          <legend className="pl-2 text-slate-500 text-xl">
            Create a new Project
          </legend>
          <div className="p-2 flex flex-col px-10 my-2">
            <label htmlFor="title" className="my-2">
              Title
            </label>
            <input
              name="title"
              placeholder="Stargazers"
              className=" input-border-within w-full p-1 rounded bg-[var(--bg-form-field)] no-scroll-style"
              id="title"
              autoFocus
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="p-2 flex flex-col px-10 my-2">
            <label htmlFor="description" className="my-2">
              Description
            </label>
            <textarea
              className="w-full p-1 outline-none h-52  rounded bg-[var(--bg-form-field)] no-scroll-style"
              name="description"
              placeholder="e.g: I see a rainbow rising "
              value={form.description}
              onChange={handleChange}
            ></textarea>
            <span className="text-sm px-1 text-gray-500">
              {' '}
              Write a descriptive description
            </span>
          </div>
          <Button name="Create" type="submit" disabled={loading} />
        </fieldset>
      </form>
    </div>
  );
};

export default ProjectForm;
