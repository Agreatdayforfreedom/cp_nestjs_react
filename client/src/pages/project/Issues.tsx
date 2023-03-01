import { useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscIssues, VscPass } from 'react-icons/vsc';
import { Link, useParams } from 'react-router-dom';
import ArrowBack from '../../components/ArrowBack';
import Button from '../../components/Button';
import Spinner from '../../components/loaders/Spinner';
import IssueForm from '../../components/project/IssueForm';
import LabelCard from '../../components/project/LabelCard';
import { IssueStatus } from '../../interfaces/enums';
import { Issue, Label } from '../../interfaces/interfaces';
import { FIND_ISSUES, PROFILE } from '../../typedefs';
import { capitalize } from '../../utils/capitalize';

const Issues = () => {
  const params = useParams();
  const {
    data,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    fetchPolicy: 'network-only',
  });

  const {
    data: iData,
    loading: iLoading,
    error: iError,
  } = useQuery(FIND_ISSUES, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  if (iLoading) return <Spinner />;
  return (
    <div>
      <Button tag="link" to="new" name="New issue" />
      {iData.findIssues.map((issue: Issue) => (
        <IssueCard key={nanoid()} issue={issue} />
      ))}
    </div>
  );
};

interface Props {
  issue: Issue;
}

const IssueCard = ({ issue }: Props) => {
  return (
    <div className="flex bg-black/60  border-t border-slate-700 last:border-y p-2 relative hover:bg-black">
      <Link
        to={`${issue.id}`}
        className="absolute top-0 left-0 w-full h-full "
      />
      <div className="mt-1.5">
        {issue.issueStatus === IssueStatus.OPEN ? (
          <VscIssues size={20} className="fill-green-500 mx-1" />
        ) : (
          <VscPass size={20} className="mx-1 fill-purple-500 " />
        )}
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl">{issue.title}</h1>
        <div>
          {issue.labels?.map((label: Label) => (
            <LabelCard key={nanoid()} label={label} />
          ))}
        </div>
        <span className="text-sm text-slate-500">#{issue.id}</span>
      </div>
    </div>
  );
};

export default Issues;
