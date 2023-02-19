import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { clearConfigCache } from 'prettier';
import React, {
  ChangeEvent,
  Component,
  ComponentType,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FaBan } from 'react-icons/fa';
import { MdOutlineEditOff } from 'react-icons/md';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Spinner from '../../components/loaders/Spinner';
import { setState } from '../../features/members/memberSlice';
import { Ban, NotificationType, Role } from '../../interfaces/enums';
import { Member as IMember } from '../../interfaces/interfaces';
import {
  BAN_MEMBER,
  CHANGE_ROLE_MEMBER,
  FIND_MEMBERS,
  FIND_PROJECT,
  MEMBER_SUB,
  PROFILE,
  REMOVE_MEMBER,
} from '../../typedefs';

const Members = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { memberClass, removed } = useAppSelector((state) => state.memberSlice);

  const {
    data: pData,
    loading: pLoading,
    error: pError,
  } = useQuery(PROFILE, {
    variables: {
      id: params.id && parseInt(params.id, 10),
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

  const { data, loading, error, subscribeToMore } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  if (loading || cpLoading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  return (
    <section className={memberClass ? memberClass : ''}>
      {data.findMembers?.map((member: IMember) => (
        <Member
          key={nanoid()}
          member={member}
          data={pData}
          project={cpData?.findOneProject}
          subs={() =>
            subscribeToMore({
              document: MEMBER_SUB,
              variables: {
                userId: pData && pData.profile.id,
                projectId: params.id && parseInt(params.id, 10),
              },
              updateQuery(prev, { subscriptionData }: any) {
                if (!subscriptionData.data) return prev;
                const subData = subscriptionData.data.memberSub;
                const notification =
                  subscriptionData.data.memberSub.notificationType;
                const exists =
                  prev &&
                  prev.findMembers.find(
                    (prev: IMember) => prev.id === subData.id,
                  );
                if (exists && notification === NotificationType.MEMBER_ADDED)
                  return; //to prevent from saving 2 equal instances

                if (notification === NotificationType.MEMBER_REMOVED) {
                  dispatch(
                    setState({
                      memberId: subData.id.toString(),
                      memberAction: notification,
                    }),
                  );
                  return Object.assign({}, prev, {
                    findMembers: prev.findMembers.filter(
                      (member: Partial<IMember>) => member.id !== subData.id,
                    ),
                  });
                }
                if (notification === NotificationType.BANNED) {
                  dispatch(
                    setState({
                      memberId: 0,
                      memberAction: notification,
                    }),
                  );
                }
                if (notification === NotificationType.MEMBER_ADDED) {
                  if (subData)
                    dispatch(
                      setState({
                        memberId: subData.id.toString(),
                        memberAction: notification,
                      }),
                    );

                  return Object.assign({}, prev, {
                    findMembers: prev.findMembers.concat(subData),
                  });
                }
              },
            })
          }
        />
      ))}
    </section>
  );
};
export default Members;

interface Props {
  member: IMember;
  data?: any;
  project?: any;
  subs?: any;
  memberSub?: number;
}

const Member = ({ member, data, project, subs }: Props) => {
  useEffect(() => subs(), []);

  const { memberId } = useAppSelector((state) => state.memberSlice);
  const ref = useRef<HTMLDivElement>(null);
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (memberId && ref.current) {
      if (memberId.toString() === ref.current.id) {
        setClassName('added');
      }
    }
  }, []);
  if (!member.user || !data || !project) return <></>;
  return (
    <div>
      <div
        ref={ref}
        id={member.id.toString()}
        className={`
    ${member.ban === Ban.BANNED && 'banned'}
    ${member.ban === Ban.PARTIAL_BAN && 'p-banned'}
    ${className === 'added' ? className : ''}
     flex justify-between  last:border-b border-slate-600 p-3`}
      >
        <MemberInfo member={member} data={data} project={project} />
        <div className="flex flex-col justify-between">
          {member.user.id !== data.profile.id &&
            data.profile.currentProjectMember.ban === Ban.UNBANNED && (
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
    </div>
  );
};

const MemberInfo = ({ member, data, project }: Props) => {
  return (
    <div>
      <div
        className={`${
          member.role === Role.ADMIN ? 'text-orange-700' : ''
        } font-semibold flex items-center py-1`}
      >
        <img
          src={member.user.avatar}
          alt={`${member.user.username} avatar`}
          className="w-8 h-8 rounded-full mr-2 text-sm"
        />
        {member.role}
        {member.ban !== Ban.UNBANNED && (
          <span className="px-1  text-red-800">{member.ban}</span>
        )}
        {member.user.id === data?.profile.id && (
          <span className="text-sm px-1 text-slate-400">(you)</span>
        )}
      </div>
      <div className={`${member.ban !== Ban.UNBANNED && 'line-through'}`}>
        {member.user.username}
        {project.owner.id === member.user.id && (
          <span className="text-sm px-1 text-slate-500">(owner)</span>
        )}
      </div>
      <p>{member.user.email}</p>
    </div>
  );
};

const SelectRole = ({ member, data, project, subs }: Props) => {
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
  const dispatch = useAppDispatch();

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
    dispatch(
      setState({
        memberId: 0,
        memberAction: 'loadlawodlaow',
      }),
    );
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
              data.profile.currentProjectMember.ban === Ban.UNBANNED && (
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
