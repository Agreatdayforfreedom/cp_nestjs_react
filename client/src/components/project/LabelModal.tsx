import { gql, useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MdChangeCircle, MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useForm } from '../../hooks/UseForm';
import { Label } from '../../interfaces/interfaces';
import { FIND_ISSUE, FIND_LABELS, NEW_LABEL } from '../../typedefs';
import randomHexa from '../../utils/randomHexa';
import Button from '../Button';
import Spinner from '../loaders/Spinner';
interface Props {
  closeLabelModal: () => void;
}

const LabelModal = ({ closeLabelModal }: Props) => {
  const [labelSelected, setLabelSelected] = useState<Form>();

  const handleLabelSelected = (data: Form) => {
    setLabelSelected(data);
  };

  return (
    <div className="fixed w-screen z-10 h-screen top-0 left-0 flex items-center justify-center bg-slate-900/60">
      <div className="relative open-label-modal bg-[var(--dark-slate)] shadow-lg p-4 shadow-slate-800 rounded w-96 h-96">
        <MdClose
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={closeLabelModal}
          size={20}
        />
        <LabelForm
          closeLabelModal={closeLabelModal}
          labelSelected={labelSelected}
        />
        <LabelList handleLabelSelected={handleLabelSelected} />
      </div>
    </div>
  );
};

interface LabelListProps {
  handleLabelSelected: (data: Form) => void;
}
interface LabelFormProps {
  closeLabelModal: () => void;
  labelSelected?: Form;
}

const LabelList = ({ handleLabelSelected }: LabelListProps) => {
  let list = [
    { labelName: 'Bug', color: '#bd6f2b' },
    { labelName: 'Question', color: '#6fbd2b' },
    { labelName: 'Enhancement', color: '#2bb8bd' },
  ];
  const params = useParams();
  const { data, loading } = useQuery(FIND_LABELS, {
    variables: {
      issueId: params.issueId && parseInt(params.issueId, 10),
    },
  });

  if (loading) return <Spinner />;
  return (
    <div>
      <h2>Labels</h2>
      <ul className="border rounded p-1 no-scroll-style overflow-y-scroll h-40">
        {list.map((label: any) => {
          return (
            <li
              key={nanoid()}
              className={`hover:bg-slate-900 hover:cursor-pointer py-2 flex items-center justify-between`}
              onClick={() =>
                handleLabelSelected({
                  labelName: label.labelName,
                  color: label.color,
                })
              }
            >
              <h3 className="text-md">{label.labelName}</h3>
              <span style={{ color: `${label.color}` }}>{label.color}</span>
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: `${label.color}` }}
              ></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface Form {
  labelName: string;
  color: string;
}

const LabelForm = ({ labelSelected, closeLabelModal }: LabelFormProps) => {
  const [color, setColor] = useState<string>(randomHexa(6));
  const [alert, setAlert] = useState<string>('');
  const params = useParams();

  const [handleChange, form, defaultValueRef, setForm] = useForm<Form>();
  const [fetch] = useMutation(NEW_LABEL, {
    onError(error, clientOptions) {
      setAlert(error.message);
      return setTimeout(() => {
        setAlert('');
      }, 3000);
    },
  });

  console.log(params);
  const { data: iData } = useQuery(FIND_ISSUE, {
    variables: {
      issueId: params.issueId && parseInt(params.issueId, 10),
    },
  });

  useEffect(() => {
    if (labelSelected) {
      setForm(labelSelected);
      setColor(labelSelected.color);
    }
  }, [labelSelected]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.labelName || !color) {
      setAlert('Complete all fields');
      return setTimeout(() => {
        setAlert('');
      }, 3000);
    }

    fetch({
      variables: {
        issueId: params.issueId && parseInt(params.issueId, 10),
        labelName: form.labelName,
        color,
      },
      update(cache, { data: { newLabel } }) {
        cache.modify({
          id: cache.identify(iData && iData.findIssue),
          fields: {
            labels(existing = []) {
              const labelAdded = cache.writeFragment({
                data: newLabel,
                fragment: gql`
                  fragment NewLabel on Label {
                    id
                    labelName
                    color
                  }
                `,
              });
              return [...existing, labelAdded];
            },
          },
        });
      },
      onCompleted(data, clientOptions) {
        closeLabelModal();
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 rounded my-3 relative"
      style={{ backgroundColor: `${color}20` }}
    >
      <fieldset>
        <legend className="absolute -top-6 left-0" style={{ color }}>
          Label Form
        </legend>
        <input
          type="text"
          placeholder="Label name"
          className="label-input  w-full bg-transparent border border-slate-400 px-1 py-px rounded "
          name="labelName"
          value={form.labelName ? form.labelName : ''}
          onChange={(e) => handleChange(e)}
        />
        <span className="text-sm text-slate-600">Max characters: 24</span>
        <div className="flex justify-center relative">
          <label
            htmlFor="selectColor"
            className="absolute left-0 text-sm hover:cursor-pointer"
          >
            <MdChangeCircle style={{ fill: `${color}` }} size={27} />
          </label>
          <input
            type="color"
            id="selectColor"
            onChange={(e) => setColor(e.target.value)}
            className="border-none w-6 h-6 bg-transparent  hidden"
          />
          <label
            htmlFor="labelColor"
            className="absolute right-0 top-0.5 w-6 h-6 rounded-full"
            style={{ backgroundColor: `${color}` }}
          ></label>
          <input
            style={{
              border: `1px solid ${color}`,
            }}
            className="focus-within:outline-none  w-10/12 bg-transparent border border-slate-400 px-1 py-px rounded"
            name="color"
            type="text"
            ref={defaultValueRef}
            value={`${color ? color : ''}`}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
        </div>
        <div
          className={`flex items-end ${
            alert ? 'justify-between' : 'justify-end'
          } `}
        >
          {alert ? <span className="alert ">{alert}</span> : undefined}
          <button
            className="bg-slate-700 text-sm p-1 mt-4 rounded-lg hover:bg-slate-800  whitespace-nowrap transition-colors"
            type="submit"
          >
            Add label
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default LabelModal;
