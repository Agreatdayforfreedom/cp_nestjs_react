import { useMutation } from '@apollo/client';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../../hooks/UseForm';
import { Issue } from '../../interfaces/interfaces';
import { NEW_ISSUE, UPDATE_ISSUE } from '../../typedefs';
import ArrowBack from '../ArrowBack';
import Button from '../Button';
import FormField from '../FormField';

interface Form extends Partial<Issue> {}

interface Props {
  updateData: Form | undefined;
}
const IssueForm = ({ updateData }: Props) => {
  const [updateMode, setUpdateMode] = useState<boolean>(false);

  const params = useParams();
  const navigate = useNavigate();

  const [handleChange, form, _, setForm] = useForm<Form>();

  const [fetch, { loading }] = useMutation(NEW_ISSUE);
  const [fetchEdit, { loading: eLoading }] = useMutation(UPDATE_ISSUE);

  useEffect(() => {
    if (updateData) {
      setUpdateMode(true);
      setForm({
        title: updateData.title,
        description: updateData.description,
      });
    }
  }, [updateData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateData) {
      fetchEdit({
        variables: {
          title: form.title,
          description: form.description,
          id: params.issueId && parseInt(params.issueId, 10),
        },
        onCompleted(data, clientOptions) {
          console.log(data);
          navigate(`../${data.updateIssue.id}`);
        },
      });
    } else {
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
    }
  };

  return (
    <div className="w-full mt-20 flex items-center relative mb-10">
      <ArrowBack to={`../${params.issueId}`} className="absolute -top-16" />
      <form
        onSubmit={handleSubmit}
        className="rounded flex items-center w-[90%] mx-auto  h-1/2 bg-[var(--bg-form)]"
      >
        <fieldset className="w-full">
          <legend className="m-2">
            {updateMode ? `Edit issue #${updateData?.id}` : 'Open issue'}
          </legend>
          <div className="p-2 flex flex-col px-10 my-2">
            <label htmlFor="title" className="my-2">
              Title
            </label>
            <input
              name="title"
              placeholder="Hi, there was a meteor shower"
              className="w-full p-1 outline-none   rounded bg-[var(--bg-form-field)] no-scroll-style"
              id="title"
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
              placeholder="A metiorite fell on the building, repair it!
              "
              value={form.description}
              onChange={handleChange}
            ></textarea>
            <span className="text-sm px-1 text-gray-500">
              {' '}
              Write a descriptive description
            </span>
          </div>

          <Button
            disabled={loading || eLoading}
            name={updateMode ? 'Save changes' : `Submit issue`}
            type="submit"
          />
        </fieldset>
      </form>
    </div>
  );
};

export default IssueForm;
