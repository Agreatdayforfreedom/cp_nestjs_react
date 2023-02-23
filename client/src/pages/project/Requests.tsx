import { useMutation, useQuery } from '@apollo/client';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RequestStatus } from '../../interfaces/enums';
import { ACTION_REQUEST, FIND_REQUESTS } from '../../typedefs';

const Requests = () => {
  const params = useParams();
  const { data } = useQuery(FIND_REQUESTS, {
    variables: {
      projectId: params.id && parseInt(params.id, 10),
    },
  });
  if (data && data.findRequests.length === 0) {
    return (
      <div className=" flex items-center justify-center h-60">
        <h4 className="px-1 text-2xl text-blue-300">No requests yet.</h4>
        <Link
          to="../search"
          className="text-xl text-blue-400 underline hover:text-blue-700 transition-colors"
        >
          Find a collaborator
        </Link>
      </div>
    );
  }
  return (
    <div>
      {data &&
        data.findRequests.map((request: any) => (
          <RequestCard request={request} />
        ))}
    </div>
  );
};

const RequestCard = ({ request }: any) => {
  const [acceptOrRejectFetch] = useMutation(ACTION_REQUEST);
  const handleAccept = (id: number) => {
    acceptOrRejectFetch({
      variables: {
        requestId: id,
        status: RequestStatus.ACCEPTED,
      },
      update(cache) {
        cache.modify({
          fields: {
            findRequests(existing, { readField }) {
              return existing.filter((m: any) => readField('id', m) !== id);
            },
            findCount(existing) {
              return existing - 1;
            },
          },
        });
      },
    });
  };
  const handleReject = (id: number) => {
    acceptOrRejectFetch({
      variables: {
        requestId: id,
        status: RequestStatus.REJECTED,
      },
      update(cache) {
        cache.modify({
          fields: {
            findRequests(existing, { readField }) {
              return existing.filter((m: any) => readField('id', m) !== id);
            },
            findCount(existing) {
              return existing - 1;
            },
          },
        });
      },
    });
  };

  return (
    <div
      key={nanoid()}
      className="flex justify-between items-center p-3 border-t last:border-y border-slate-700"
    >
      <div className="flex items-center">
        <img
          src={request.user.avatar}
          alt={`${request.user.username} avatar`}
          className="w-8 h-8 rounded-full mr-2 text-sm"
        />
        <span className="px-2">{request.user.username}</span>
        <span className="px-2">{request.user.email}</span>
      </div>

      <div className="flex">
        {request.requestStatus === RequestStatus.PENDING ? (
          <>
            <button
              className="px-1.5 text-green-600 hover:text-green-800 transition-colors"
              onClick={() => handleAccept(request.id)}
            >
              Accept
            </button>
            <button
              className="px-1.5 text-red-600 hover:text-red-800 transition-colors"
              onClick={() => handleReject(request.id)}
            >
              Reject
            </button>
          </>
        ) : (
          <p>{request.requestStatus}</p>
        )}
      </div>
    </div>
  );
};

export default Requests;
