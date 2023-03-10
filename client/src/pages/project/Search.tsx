import { gql, useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { BiCheck } from 'react-icons/bi';
import { Navigate, useParams } from 'react-router-dom';
import ArrowBack from '../../components/ArrowBack';
import Button from '../../components/Button';
import Spinner from '../../components/loaders/Spinner';
import { SearchBar } from '../../components/SearchBar';
import { Member, User } from '../../interfaces/interfaces';
import { ADD_MEMBER, FIND_MEMBERS, SEARCH_USERS } from '../../typedefs';

const Search = () => {
  const params = useParams();

  const { data, loading, error, refetch } = useQuery(SEARCH_USERS);

  const { data: membersData } = useQuery(FIND_MEMBERS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  const [fetch] = useMutation(ADD_MEMBER);

  const handleClick = (memberId: number) => {
    fetch({
      variables: {
        nextMemberId: memberId,
        projectId: params.id && parseInt(params.id, 10),
      },
      update(cache, { data: { addMember } }) {
        cache.modify({
          fields: {
            findMembers(existing) {
              const newMember = cache.writeFragment({
                data: addMember,
                fragment: gql`
                  fragment NewMember on Member {
                    id
                    __typename
                  }
                `,
              });
              return [...existing, newMember];
            },
          },
        });
      },
    });
  };

  const memberIds: number[] =
    membersData &&
    membersData.findMembers.map((member: Member) => member.user.id);

  if (loading) return <Spinner />;
  if (error) return <Navigate to="/" />;
  return (
    <div>
      <ArrowBack to="../members" />

      <SearchBar label="Find a user" refetch={refetch} />
      <div className="w-full flex justify-center">
        <p className="text-slate-400 text-xl font-bold">
          {data && data.searchUsers.count} users found
        </p>
      </div>
      {data &&
        data.searchUsers.users.map((user: User) => (
          <div
            key={nanoid()}
            className="flex justify-between items-center p-3 border-t last:border-y border-slate-700"
          >
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={`${user.username} avatar`}
                className="w-8 h-8 rounded-full mr-2 text-sm"
              />
              <span className="px-2">{user.username}</span>
              <span className="px-2">{user.email}</span>
            </div>
            {memberIds?.find((id: number) => id === user.id) ? (
              <div className="p-0.5 mx-6 bg-green-600 rounded-full">
                <BiCheck size={25} />
              </div>
            ) : (
              <Button
                name="Add"
                color="blue"
                className="!my-0"
                onClick={() => handleClick(user.id)}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default Search;
