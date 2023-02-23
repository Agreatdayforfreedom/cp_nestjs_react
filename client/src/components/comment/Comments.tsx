import { gql, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  COMMENT_SUB,
  DELETE_COMMENT,
  EDIT_COMMENT,
  FIND_COMMENTS,
  NEW_COMMENT,
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

  const [options, setOptions] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [fetch] = useMutation(DELETE_COMMENT);

  const openOptions = () => {
    setOptions((prev) => !prev);
  };

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

  return (
    <div className="relative py-4 first:pt-0">
      <div className="timeline z-10 border-slate-700">
        <div className="relative border border-neutral-900 bg-[var(--medium-blue)] p-2 rounded mx-auto">
          <div className="border-b flex items-end justify-between pb-2 pt-1 border-slate-700">
            <div className="flex items-end">
              <img
                src={comment.owner.user.avatar}
                alt={`${comment.owner.user.username} avatar`}
                className="w-8 h-8 rounded-full"
              />
              <h2 className="px-2">{comment.owner.user.username}</h2>
            </div>
            <button className="absolute top-0.5 right-2" onClick={openOptions}>
              <BsThreeDots size={20} />
            </button>
            {options ? (
              <div className=" absolute bg-[var(--dark-purple)] top-5 right-5 rounded shadow flex items-center shadow-slate-800 text-sm font-semibold open-options">
                <ul className="w-full text-center">
                  <li>
                    <button
                      className="hover:text-orange-600 transition-colors"
                      onClick={editClicked}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="hover:text-red-600 transition-colors"
                      onClick={deleteClicked}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            ) : undefined}
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
    </div>
  );
};

const CommentForm = () => {
  const [content, setContent] = useState<string>('');

  const actionPayload = useAppSelector((state) => state.commentSlice);
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    setContent(actionPayload.content);
  }, [actionPayload.content]);

  const [fetch] = useMutation(NEW_COMMENT);
  const [fetchEdit] = useMutation(EDIT_COMMENT);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actionPayload.editMode) {
      console.log(content);
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
        update: (cache, { data: { newComment } }) => {
          console.log(newComment);
          cache.modify({
            fields: {
              findComments(existing) {
                const commentAdded = cache.writeFragment({
                  data: newComment,
                  fragment: gql`
                    fragment NewComment on Comment {
                      id
                      __typename
                    }
                  `,
                });
                return [...existing, commentAdded];
              },
            },
          });
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
        className={`p-1 ${actionPayload.editMode ? 'flash-orange' : ''}`}
      >
        <textarea
          name="content"
          id="content"
          placeholder="leave a comment"
          className={`${
            actionPayload.editMode ? 'border-orange-900 ' : ''
          } w-full border p-2 outline-none bg-[var(--dark-purple)] border-slate-700 rounded`}
          value={content ? content : content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          {actionPayload.editMode ? (
            <button
              type="button"
              className="text-slate-400 font-bold my-2 p-2 hover:text-slate-500 transition-all"
              onClick={() => dispatch(clearState())}
            >
              Cancel
            </button>
          ) : undefined}
          <Button
            type="submit"
            className="w-fit"
            name={actionPayload.editMode ? 'Save changes' : 'Comment'}
          />
        </div>
      </form>
    </div>
  );
};

export default Comments;
