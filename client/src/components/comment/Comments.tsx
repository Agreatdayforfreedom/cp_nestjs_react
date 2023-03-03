import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  COMMENT_SUB,
  DELETE_COMMENT,
  EDIT_COMMENT,
  FIND_COMMENTS,
  MINIMIZE_COMMENT,
  NEW_COMMENT,
  PROFILE,
} from '../../typedefs';
import { Comment as IComment } from '../../interfaces/interfaces';
import Spinner from '../loaders/Spinner';
import Button from '../Button';
import { FormEvent, useEffect, useState } from 'react';
import { parseAndCompareDate } from '../../utils/parseAndCompareDate';
import { BsThreeDots } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearState, setState } from '../../features/commentSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useAlert } from '../../hooks/useAlert';
import { Ban } from '../../interfaces/enums';
import { FaBan } from 'react-icons/fa';

const Comments = () => {
  const params = useParams();
  const { data, loading, subscribeToMore } = useQuery(FIND_COMMENTS, {
    variables: {
      issueId: params.issueId && parseInt(params.issueId, 10),
    },
  });

  if (loading) return <Spinner />;
  return (
    <div className="py-10 w-[95%] mx-auto">
      {data?.findComments.length > 0 ? (
        data.findComments.map((comment: IComment) => (
          <Comment
            key={nanoid()}
            comment={comment}
            subs={() =>
              subscribeToMore({
                document: COMMENT_SUB,
                updateQuery(prev, { subscriptionData }) {
                  const { commentSub } = subscriptionData.data;

                  if (!commentSub) return prev;
                  const exists =
                    prev &&
                    prev.findComments.find(
                      (prev: IComment) => prev.id === commentSub.id,
                    );
                  if (exists) return;

                  return Object.assign({}, prev, {
                    findComments: prev.findComments.concat(commentSub),
                  });
                },
              })
            }
          />
        ))
      ) : (
        <span className="text-xl block italic underline text-slate-500 w-full text-center">
          There are not comments yet.
        </span>
      )}
      <CommentForm />
    </div>
  );
};

interface Props {
  comment: IComment;
  subs: any;
}

const Comment = ({ comment, subs }: Props) => {
  useEffect(() => subs(), []);

  if (comment.minimized) {
    return (
      <div className="relative flex flex-col rounded-r items-center py-2 justify-center border-2  ml-[10px] border-[var(--timeline-color)]">
        <img
          src={
            comment.owner?.user
              ? comment.owner.user?.avatar
              : '/public/empty-user.webp'
          }
          alt={`${
            comment.owner?.user
              ? comment.owner.user?.username
              : `user${comment.id}`
          } avatar`}
          className="w-8 h-8 rounded-full"
        />
        <CommentActions comment={comment} />
        <span className="font-bold text-slate-700">Minimized</span>
      </div>
    );
  }
  return (
    <div className="relative z-0 py-4 first:pt-0">
      <div className="timeline border-slate-700"></div>
      <div className="border border-neutral-900 bg-[var(--medium-blue)] p-2 rounded mx-auto">
        <div className="relative border-b flex items-end justify-between pb-2 pt-1 border-slate-700">
          <div className="flex items-end">
            <img
              src={
                comment.owner?.user
                  ? comment.owner.user?.avatar
                  : '/public/empty-user.webp'
              }
              alt={`${
                comment.owner?.user
                  ? comment.owner.user?.username
                  : `user${comment.id}`
              } avatar`}
              className="w-8 h-8 rounded-full"
            />
            <h2 className="px-2">{`${
              comment.owner?.user
                ? comment.owner.user?.username
                : `user${comment.id}`
            }`}</h2>
          </div>

          <CommentActions comment={comment} />

          <span className="text-xs text-slate-500">
            {parseAndCompareDate(
              comment.created_at.toString(),
              comment.updated_at.toString(),
            )}
          </span>
        </div>
        <p className="break-all p-2">{comment.content}</p>
      </div>
    </div>
  );
};

interface CAProps {
  comment: IComment;
}

const CommentActions = ({ comment }: CAProps) => {
  const [options, setOptions] = useState<boolean>(false);

  const openOptions = () => {
    setOptions((prev) => !prev);
  };

  const { data } = useQuery(PROFILE);

  const dispatch = useAppDispatch();

  const [fetch] = useMutation(DELETE_COMMENT);
  const [fetchMinimize] = useMutation(MINIMIZE_COMMENT);

  const editClicked = () => {
    dispatch(
      setState({ id: comment.id, content: comment.content, editMode: true }),
    );
    setOptions(false);
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  const deleteClicked = () => {
    fetch({
      variables: {
        commentId: comment.id,
      },
      update(cache) {
        cache.modify({
          fields: {
            findComments: (existing, { readField }) => {
              return existing.filter(
                (x: any) => readField('id', x) !== comment.id,
              );
            },
          },
        });
      },
    });
    setOptions(false);
  };

  const handleMinimize = () => {
    fetchMinimize({
      variables: {
        commentId: comment.id,
        minimized: !comment.minimized,
      },
    });
  };

  return (
    <>
      <button className="absolute top-0.5 right-2" onClick={openOptions}>
        <BsThreeDots size={20} />
      </button>
      {options && data?.profile.currentProjectMember.ban !== Ban.BANNED ? (
        <div className=" absolute bg-[var(--dark-slate)]  top-5 right-5 rounded shadow flex items-center shadow-slate-800 text-sm font-semibold open-options">
          <ul className="w-full text-center">
            {data &&
            data.profile?.currentProjectMember.id === comment.owner?.id ? (
              <>
                <li className="p-1 hover:bg-slate-700">
                  <button className=" transition-colors" onClick={editClicked}>
                    Edit
                  </button>
                </li>
                <li className="p-1 hover:bg-slate-700">
                  <button
                    className=" transition-colors"
                    onClick={deleteClicked}
                  >
                    Delete
                  </button>
                </li>
              </>
            ) : undefined}

            <li className="p-1 hover:bg-slate-700">
              <button className=" transition-colors" onClick={handleMinimize}>
                {comment.minimized ? 'Maximize' : 'Minimize'}
              </button>
            </li>
          </ul>
        </div>
      ) : undefined}
    </>
  );
};

const CommentForm = () => {
  const [alert, setAlert] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const actionPayload = useAppSelector((state) => state.commentSlice);
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    setContent(actionPayload.content);
  }, [actionPayload.content]);
  const [handleAlert] = useAlert();

  const { data } = useQuery(PROFILE);
  const [fetch] = useMutation(NEW_COMMENT);
  const [fetchEdit] = useMutation(EDIT_COMMENT);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content === '') {
      setAlert('The content cannot be empty');
      return setTimeout(() => {
        setAlert('');
      }, 3000);
    }
    if (actionPayload.editMode) {
      fetchEdit({
        variables: {
          commentId: actionPayload.id,
          content,
        },
        onCompleted(data, clientOptions) {
          dispatch(clearState());
        },
      });
    } else {
      fetch({
        variables: {
          issueId: params.issueId && parseInt(params.issueId, 10),
          content,
        },

        onCompleted(data, clientOptions) {
          dispatch(clearState());
        },
      });
    }
  };

  return (
    <div className=" border-t-2 border-[var(--timeline-color)] pt-2 border-slate-700">
      <form
        onSubmit={handleSubmit}
        className={`p-1  rounded ${
          actionPayload.editMode ? 'flash-orange' : ''
        } `}
      >
        <textarea
          disabled={
            data && data.profile.currentProjectMember?.ban === Ban.BANNED
          }
          name="content"
          id="content"
          placeholder="leave a comment"
          className={`${
            actionPayload.editMode ? 'border-orange-900 ' : ''
          } w-full border p-2 outline-none bg-[var(--dark-purple)] input-border-within border-slate-700 rounded`}
          value={content ? content : content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end items-center">
          {actionPayload.editMode ? (
            <button
              type="button"
              className="text-slate-400 font-bold my-2 p-2 hover:text-slate-500 transition-all"
              onClick={() => dispatch(clearState())}
            >
              Cancel
            </button>
          ) : undefined}
          {data && data.profile.currentProjectMember?.ban === Ban.BANNED ? (
            <>
              <span className="px-1 text-red-700">You has been banned.</span>
              <FaBan size={20} className="fill-red-700" />
            </>
          ) : (
            ''
          )}
          {alert ? <span className="alert">{alert}</span> : undefined}
          <Button
            type="submit"
            className="w-fit"
            disabled={
              data && data.profile.currentProjectMember?.ban === Ban.BANNED
            }
            name={actionPayload.editMode ? 'Save changes' : 'Comment'}
          />
        </div>
      </form>
    </div>
  );
};

export default Comments;
