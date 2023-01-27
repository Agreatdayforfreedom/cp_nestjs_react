import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { FIND_MEMBERS, REMOVE_MEMBER } from '../../typedefs';

const Members = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  const [
    fetch,
    { data: dataRemove, loading: loadingRemove, error: errorRemove },
  ] = useMutation(REMOVE_MEMBER);

  const handleDelete = (memberId: number) => {
    fetch({
      variables: { memberId, projectId: params.id && parseInt(params.id, 10) },
    });
  };

  if (error) return <span>error</span>;
  if (loading) return <span>loading</span>;
  return (
    <section>
      <div className="flex justify-between border-t border-slate-600 mt-5 p-3">
        <div>admin</div>
      </div>
      {data.findMembers.map((member: any) => (
        <div className="flex justify-between border-t last:border-b border-slate-600 p-3">
          <div>{member.role}</div>
          <p>{member.id}</p>
          <div>
            <p>{member.user.username}</p>
            <p>{member.user.email}</p>
          </div>
          <Button
            name="delete"
            color="red"
            className="!m-0 h-fit text-blue-900"
            onClick={() => handleDelete(member.id)}
          />
        </div>
      ))}
    </section>
  );
};

export default Members;
