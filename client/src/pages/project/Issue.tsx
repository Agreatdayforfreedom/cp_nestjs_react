import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscIssues, VscPass } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import LabelCard, { LabelModalInfo } from '../../components/project/LabelCard';
import LabelModal from '../../components/project/LabelModal';
import { IssueStatus } from '../../interfaces/enums';
import { Label } from '../../interfaces/interfaces';
import { FIND_ISSUE } from '../../typedefs';
import { capitalize } from '../../utils/capitalize';

const Issue = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_ISSUE, {
    variables: {
      issueId: params.id && parseInt(params.id, 10),
    },
  });
  if (loading) return <Spinner />;
  return (
    <section>
      <div className="mt-1.5 flex items-center ">
        {data.findIssue.issueStatus === IssueStatus.OPEN ? (
          <VscIssues size={20} className="fill-green-500 mx-1" />
        ) : (
          <VscPass size={20} className="mx-1 fill-purple-500 " />
        )}
        <span className="text-slate-500">{data.findIssue.issueStatus}</span>
      </div>
      <h1 className="text-slate-200 text-2xl m-2 border-b border-slate-700">
        {data.findIssue.title}
      </h1>
      <Labels labels={data.findIssue.labels} />
      <p className="p-3 border-b border-slate-700">
        {data.findIssue.description}
      </p>

      <Comments />
    </section>
  );
};

interface Props {
  labels: Label[];
}

const Labels = ({ labels }: Props) => {
  const [openLabelModal, setOpenLabelModal] = useState<boolean>(false);
  const [openLabelInfoModal, setOpenLabelInfoModal] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<Label>({} as Label);
  const fnOpenLabelInfoModal = (cLabel: Label) => {
    setCurrentLabel(cLabel);
    setOpenLabelInfoModal(true);
  };
  const fnCloseLabelInfoModal = () => {
    setOpenLabelInfoModal(false);
  };
  const closeLabelModal = () => {
    setOpenLabelModal(false);
  };
  return (
    <div className="flex items-center px-2 pb-2 border-b border-slate-700">
      {labels.map((label: Label) => {
        return (
          <>
            <LabelCard
              label={label}
              fnOpenLabelInfoModal={fnOpenLabelInfoModal}
            />
          </>
        );
      })}
      <AiOutlinePlus
        size={20}
        onClick={() => setOpenLabelModal((prev) => !prev)}
        className="hover:cursor-pointer"
      />
      {/*delete label, show info  */}
      {openLabelInfoModal ? (
        <LabelModalInfo
          currentLabel={currentLabel}
          fnCloseLabelInfoModal={fnCloseLabelInfoModal}
        />
      ) : undefined}
      {/* add new label */}
      {openLabelModal ? (
        <LabelModal closeLabelModal={closeLabelModal} />
      ) : undefined}
    </div>
  );
};

const Comments = () => {
  //todo
  return <div className="py-10">Comments...</div>;
};
export default Issue;
