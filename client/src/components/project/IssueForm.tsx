import { useMutation } from '@apollo/client';
import React, { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../hooks/UseForm';
import { Issue } from '../../interfaces/interfaces';
import { NEW_ISSUE } from '../../typedefs';
import Button from '../Button';
import FormField from '../FormField';

interface Form extends Partial<Issue> {}

const IssueForm = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [handleChange, form] = useForm<Form>();

  const [fetch] = useMutation(NEW_ISSUE);

  //todo: create issue page
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch({
      variables: {
        title: form.title,
        description: form.description,
        projectId: params.id && parseInt(params.id, 10),
      },
      onCompleted(data) {
        navigate(`${data.id}`);
      },
    });
  };

  return (
    <div className="w-full mt-20 flex items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded flex items-center w-[90%] mx-auto h-1/2 bg-[var(--bg-form)]"
      >
        <fieldset className="w-full">
          <legend className="m-2">Open issue</legend>
          <FormField name="title" value={form.title} onChange={handleChange} />
          <FormField
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <Button name="Submit issue" type="submit" />
        </fieldset>
      </form>
    </div>
  );
};

export default IssueForm;
