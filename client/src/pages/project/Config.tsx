import { Reference, useMutation, useQuery } from '@apollo/client';
import React, { FormEvent, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../../interfaces/interfaces';
import { DELETE_PROJECT, FIND_PROJECT } from '../../typedefs';

const Config = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fnOpenModal = () => {
    setOpenModal(true);
  };

  const fnCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="h-60 flex flex-col justify-between">
      <p className="animate-pulse p-4">Hi, this section is empty...</p>
      <div className="flex justify-end">
        <button
          onClick={fnOpenModal}
          className="p-2 mx-2 border border-red-800 rounded text-red-700 hover:bg-[var(--t-blood)]"
        >
          Delete project
        </button>
      </div>
      <ConfirmDelete openModal={openModal} fnCloseModal={fnCloseModal} />
    </div>
  );
};

interface CDProps {
  openModal: boolean;
  fnCloseModal: () => void;
}

const ConfirmDelete = ({ openModal, fnCloseModal }: CDProps) => {
  const [validateName, setValidateName] = useState<string>('');
  const [alert, setAlert] = useState<string>('');

  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(FIND_PROJECT, {
    fetchPolicy: 'network-only',
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  const [fetch, { loading: DelLoading }] = useMutation(DELETE_PROJECT);

  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateName) {
      setAlert('Please fill out the field.');
      return setTimeout(() => {
        setAlert('');
      }, 3000);
    }

    fetch({
      variables: {
        projectId: params.id && parseInt(params.id, 10),
        validateName,
      },
      update(cache) {
        cache.modify({
          fields: {
            findMyProjects(existing, { readField }) {
              return existing.filter(
                (ref: Reference) => params.id !== readField('id', ref),
              );
            },
          },
        });
      },
      onCompleted() {
        navigate('/');
      },
      onError(data) {
        setAlert(data.message);
        setTimeout(() => {
          setAlert('');
        }, 3000);
      },
    });
  };

  if (!openModal) return <></>;
  return (
    <div
      className={`
      ${DelLoading ? 'bg-[var(--t-blood)]' : undefined}

    fixed w-screen z-10 h-screen top-0 left-0 
    flex items-center justify-center bg-slate-900/60`}
    >
      <div
        className={` relative open-label-modal bg-[var(--dark-slate)] shadow-lg p-4 shadow-slate-800 rounded w-96 h-auto `}
      >
        <MdClose
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={fnCloseModal}
          size={20}
        />
        <form
          onSubmit={handleDelete}
          className="flex flex-col justify-around h-20"
        >
          <label className="">
            Write{' '}
            <span className="font-bold text-lg">
              {data?.findOneProject.title}
            </span>{' '}
            to delete this project.
          </label>
          <div className="flex">
            <input
              type="text"
              className="w-full input-border-within bg-transparent border border-purple-900"
              onChange={(e) => setValidateName(e.target.value)}
              value={validateName}
            />
            <button
              type="submit"
              disabled={DelLoading}
              className="mx-1 text-red-700 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </form>
        {alert ? <p className="alert">{alert}</p> : undefined}
      </div>
    </div>
  );
};

export default Config;
