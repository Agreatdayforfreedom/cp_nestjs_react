import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { ChangeEvent } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FaBan } from 'react-icons/fa';
import { MdOutlineEditOff } from 'react-icons/md';
import { Navigate, useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import { Ban, Role } from '../../interfaces/enums';
import { Member as IMember } from '../../interfaces/interfaces';
import {
  BAN_MEMBER,
  CHANGE_ROLE_MEMBER,
  FIND_MEMBERS,
  FIND_PROJECT,
  PROFILE,
  REMOVE_MEMBER,
} from '../../typedefs';

const Members = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });

  const {
    data: cpData,
    loading: cpLoading,
    error: cpError,
  } = useQuery(FIND_PROJECT, {
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });

  const {
    data: pData,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    variables: {
      id: params.id && parseInt(params.id, 10),
    },
  });
  if (loading || pLoading || cpLoading) return <Spinner />;
  if (error || pError) return <Navigate to="dashboard" />;
  return (
    <section>
      {data.findMembers.map((member: IMember) => (
        <Member
          key={nanoid()}
          member={member}
          data={pData}
          project={cpData?.findOneProject}
        />
      ))}
    </section>
  );
};
export default Members;

interface Props {
  member: IMember;
  data: any;
  project: any;
}

const Member = ({ member, data, project }: Props) => {
  return (
    <div
      className={`
    ${member.ban === Ban.BANNED && 'bg-[var(--t-red)]'}
    ${member.ban === Ban.PARTIAL_BAN && 'bg-[var(--t-orange)]'}
     flex justify-between border-t last:border-b border-slate-600 p-3`}
    >
      <MemberInfo member={member} data={data} project={project} />
      <div className="flex flex-col justify-between">
        {member.user.id !== data.profile.id &&
          data.profile.currentProjectMember.ban === Ban.NO_BAN && (
            <>
              <Buttons member={member} data={data} project={project} />
              {project.owner.id !== member.user.id &&
                data.profile.currentProjectMember.role !== Role.MEMBER && (
                  <SelectRole member={member} data={data} project={project} />
                )}
            </>
          )}
      </div>
    </div>
  );
};

const MemberInfo = ({ member, data, project }: Props) => {
  return (
    <div>
      <div
        className={`${
          member.role === Role.ADMIN ? 'text-orange-700' : ''
        } font-semibold`}
      >
        {member.role}
        {member.ban !== Ban.NO_BAN && (
          <span className="px-1  text-red-800">{member.ban}</span>
        )}
        {member.user.id === data?.profile.id && (
          <span className="text-sm px-1 text-slate-400">(you)</span>
        )}
      </div>
      <div className={`${member.ban !== Ban.NO_BAN && 'line-through'}`}>
        {member.user.username}
        {project.owner.id === member.user.id && (
          <span className="text-sm px-1 text-slate-500">(owner)</span>
        )}
      </div>
      <p>{member.user.email}</p>
    </div>
  );
};

const SelectRole = ({ member, data, project }: Props) => {
  const [fetchChangeRole] = useMutation(CHANGE_ROLE_MEMBER);

  const handleGiveRole = (
    e: ChangeEvent<HTMLSelectElement>,
    memberId: number,
  ) => {
    const { value } = e.target;
    fetchChangeRole({
      variables: {
        memberId,
        roleType: value,
      },
    });
  };

  return (
    <select
      onChange={(e) => handleGiveRole(e, member.id)}
      defaultValue={member.role}
      className="c-select hover:cursor-pointer"
    >
      <option value={Role.ADMIN}>Admin</option>
      <option value={Role.MODERATOR}>Moderator</option>
      <option value={Role.MEMBER}>Member</option>
    </select>
  );
};

const Buttons = ({ member, data, project }: Props) => {
  const params = useParams();
  const [fetchRemove] = useMutation(REMOVE_MEMBER);
  const [fetchBan] = useMutation(BAN_MEMBER);

  const handleBan = (
    memberToBanId: number,
    memberWhoBanId: number,
    banType: Ban,
  ) => {
    fetchBan({
      variables: {
        memberToBanId,
        memberWhoBanId,
        banType,
      },
    });
  };

  const handleDelete = (memberId: number) => {
    fetchRemove({
      variables: { memberId, projectId: params.id && parseInt(params.id, 10) },
      update(cache) {
        cache.modify({
          fields: {
            findMembers(existing, { readField }) {
              return existing.filter(
                (m: any) => readField('id', m) !== memberId,
              );
            },
          },
        });
      },
    });
  };

  return (
    <div>
      {member.role !== Role.ADMIN &&
        data.profile.currentProjectMember.role !== Role.MEMBER && (
          <div className="flex items-center py-2">
            <button
              onClick={() =>
                handleBan(
                  member.id,
                  data.profile.currentProjectMember.id,
                  Ban.BANNED,
                )
              }
            >
              <FaBan
                className={`
                  ${
                    member.ban === Ban.BANNED && 'fill-red-600 '
                  } mx-1 hover:cursor-pointer hover:fill-slate-500`}
              />
            </button>
            <button
              onClick={() =>
                handleBan(
                  member.id,
                  data.profile.currentProjectMember.id,
                  Ban.PARTIAL_BAN,
                )
              }
            >
              <MdOutlineEditOff
                size={20}
                className={`
                  ${
                    member.ban === Ban.PARTIAL_BAN && 'fill-red-600 '
                  } mx-1 hover:cursor-pointer hover:fill-slate-500`}
              />
            </button>

            {data.profile.currentProjectMember.role === Role.ADMIN &&
              data.profile.currentProjectMember.ban === Ban.NO_BAN && (
                <button onClick={() => handleDelete(member.id)}>
                  <AiFillDelete className="fill-red-700 hover:fill-red-900" />
                </button>
              )}
          </div>
        )}
    </div>
    //todo: moderator cannot chage the role of others members to admin.
  );
};
