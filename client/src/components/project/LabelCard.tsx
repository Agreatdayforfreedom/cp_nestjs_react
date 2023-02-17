import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Label } from '../../interfaces/interfaces';
import { FIND_ISSUE, QUIT_LABEL } from '../../typedefs';
import { capitalize } from '../../utils/capitalize';

interface Props {
  label: Label;
  fnOpenLabelInfoModal?: (currentLabel: Label) => void;
}

const LabelCard = ({ label, fnOpenLabelInfoModal }: Props) => {
  return (
    <span
      style={{
        color: `${label.color}`,
        backgroundColor: `${label.color}40`,
        border: `1px solid ${label.color}`,
      }}
      className={`hover:cursor-pointer mr-1 bg-rand rounded-xl text-sm px-2 border`}
      onClick={() =>
        fnOpenLabelInfoModal instanceof Function
          ? fnOpenLabelInfoModal(label)
          : undefined
      }
    >
      {capitalize(label.labelName)}
    </span>
  );
};

interface LMIProps {
  currentLabel: Label;
  fnCloseLabelInfoModal: () => void;
}

export const LabelModalInfo = ({
  currentLabel,
  fnCloseLabelInfoModal,
}: LMIProps) => {
  const [fetch, { loading }] = useMutation(QUIT_LABEL);
  const params = useParams();

  const { data: iData } = useQuery(FIND_ISSUE, {
    variables: {
      issueId: params.id && parseInt(params.id, 10),
    },
  });

  const quitLabel = () => {
    console.log(iData);
    fetch({
      variables: {
        labelId: currentLabel.id,
      },
      update(cache) {
        cache.modify({
          id: cache.identify(iData && iData.findIssue),
          fields: {
            labels(existing, { readField }) {
              return existing.filter(
                (ref: any) => currentLabel.id !== readField('id', ref),
              );
            },
          },
        });
      },
      onCompleted() {
        fnCloseLabelInfoModal();
      },
    });
  };

  return (
    <div
      className={`
    fixed w-screen  h-screen top-0 left-0 
    flex items-center justify-center bg-slate-900/60`}
    >
      <div
        className={`${
          loading ? 'opacity-50' : ''
        } relative open-label-modal bg-[var(--dark-slate)] shadow-lg p-4 shadow-slate-800 rounded w-96 h-auto `}
      >
        <MdClose
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={fnCloseLabelInfoModal}
          size={20}
        />
        <div className="animate-pulse">Add info here... </div>
        <div className="text-end mt-5">
          <button
            onClick={quitLabel}
            className="text-red-700 hover:text-red-800"
          >
            Quit Label
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelCard;
