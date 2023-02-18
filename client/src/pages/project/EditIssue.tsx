import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import IssueForm from '../../components/project/IssueForm';
import { FIND_ISSUE } from '../../typedefs';

const EditIssue = () => {
  const params = useParams();
  const { data, loading } = useQuery(FIND_ISSUE, {
    variables: {
      issueId: params.issueId && parseInt(params.issueId, 10),
    },
  });
  if (loading) return <Spinner />;
  return (
    <div>
      <IssueForm updateData={data ? data.findIssue : undefined} />
    </div>
  );
};

export default EditIssue;
