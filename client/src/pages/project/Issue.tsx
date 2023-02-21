import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { AiFillDelete, AiOutlinePlus } from 'react-icons/ai';
import { VscIssues, VscPass } from 'react-icons/vsc';
import { HiPencil } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import LabelCard, { LabelModalInfo } from '../../components/project/LabelCard';
import LabelModal from '../../components/project/LabelModal';
import { IssueStatus } from '../../interfaces/enums';
import { Label } from '../../interfaces/interfaces';
import { FIND_COMMENTS, FIND_ISSUE, PROFILE } from '../../typedefs';
import { nanoid } from '@reduxjs/toolkit';
import { MdClose } from 'react-icons/md';
import { parseAndCompareDate } from '../../utils/parseAndCompareDate';
import Comments from '../../components/comment/Comments';

const Issue = () => {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const params = useParams();

  const fnCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const { data: pData } = useQuery(PROFILE);

  const { data, loading, error } = useQuery(FIND_ISSUE, {
    variables: {
      issueId: params.issueId && parseInt(params.issueId, 10),
    },
  });
  if (loading) return <Spinner />;
  return (
    <section>
      <div className="px-2 pt-1 flex justify-between items-center ">
        <div className="flex items-center">
          {data.findIssue.issueStatus === IssueStatus.OPEN ? (
            <VscIssues size={20} className="fill-green-500 mx-1" />
          ) : (
            <VscPass size={20} className="mx-1 fill-purple-500 " />
          )}
          <span className="text-slate-500">{data.findIssue.issueStatus}</span>
        </div>

        {pData.profile.currentProjectMember.id === data.findIssue.owner.id && (
          <div className="flex items-center">
            <Link to={`edit`}>
              <HiPencil
                size={20}
                className="fill-orange-700 hover:fill-orange-900 hover:cursor-pointer"
              />
            </Link>
            <AiFillDelete
              className="ml-2 fill-red-700 hover:fill-red-900 hover:cursor-pointer"
              onClick={() => setOpenDeleteModal((prev) => !prev)}
            />
          </div>
        )}
      </div>
      <div className="border-b border-slate-700 m-2">
        <h1 className="text-slate-200 py-2 px-3 text-2xl  ">
          {data.findIssue.title}
        </h1>
        <span className="text-sm block w-full text-end text-slate-600">
          {parseAndCompareDate(
            data.findIssue.created_at,
            data.findIssue.updated_at,
          )}
        </span>
      </div>
      <Labels labels={data.findIssue.labels} />
      <p className="p-3 border-b text-slate-400 border-slate-700">
        {data.findIssue.description}
      </p>
      {openDeleteModal ? (
        <DeleteModal fnCloseDeleteModal={fnCloseDeleteModal} />
      ) : undefined}
      <Comments />
    </section>
  );
};

const DeleteModal = ({
  fnCloseDeleteModal,
}: {
  fnCloseDeleteModal: () => void;
}) => {
  return (
    <div
      className={`
fixed w-screen z-10 h-screen top-0 left-0 
flex items-center justify-center bg-slate-900/60`}
    >
      <div
        className={` relative open-label-modal bg-[var(--dark-slate)] shadow-lg p-4 shadow-slate-800 rounded w-96 h-auto `}
      >
        <MdClose
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={fnCloseDeleteModal}
          size={20}
        />
        <div className="animate-pulse">Add funtionality...</div>
        <div className="text-end mt-4">
          <button
            // onClick={fetch}
            className="text-red-700 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
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
      <span className="mr-3 text-slate-500">Labels: </span>
      {labels.map((label: Label) => {
        return (
          <LabelCard
            key={nanoid()}
            label={label}
            fnOpenLabelInfoModal={fnOpenLabelInfoModal}
          />
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

export default Issue;
