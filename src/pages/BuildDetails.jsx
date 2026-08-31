import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as buildService from '../services/build';
import { useRef } from 'react';
import toast from 'react-hot-toast'


const BuildDetails = ({ user }) => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const [build, setBuild] = useState(null);
  const [commentText, setCommentText] = useState('');
 const dialogRef = useRef(null);
const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();
  useEffect(() => {
    const fetchBuild = async () => {
      const buildData = await buildService.show(buildId);
      setBuild(buildData);
    };
    fetchBuild();
  }, [buildId]);

  if (!build) return <p>Loading...</p>;

  const isOwner = build.owner?._id === user?._id;
  const isLiked = build.likes?.includes(user?._id);

  const handleLike = async () => {
    const updatedBuild = await buildService.likeToggle(buildId);
    setBuild(updatedBuild);
  };

  const handleDelete = async () => {
    await buildService.deleteBuild(buildId);
      toast.success('Build deleted')

    navigate('/builds');
  };

  const handleCommentSubmit = async (evt) => {
    evt.preventDefault();
    await buildService.addComment(buildId, { comment: commentText });
    setCommentText('');
    const buildData = await buildService.show(buildId);
    setBuild(buildData);
  };

  const handleCommentDelete = async (commentId) => {
    await buildService.deleteComment(buildId, commentId);
    const buildData = await buildService.show(buildId);
    setBuild(buildData);
  };

  return (
    <div>
      {build.image?.url && <img src={build.image.url} alt={build.caption} width="300" />}
      <p>{build.caption}</p>
      <p>
        {build.theme} · {build.isMOC ? 'MOC' : 'Official set'} · {build.status}
      </p>
      <p>Time taken: {build.timeTaken} minutes</p>
      <p>by {build.owner?.username}</p>

      <button onClick={handleLike}>
        {isLiked ? 'Unlike' : 'Like'} ({build.likes?.length || 0})
      </button>

      {isOwner && (
        <div>
          <Link to={`/builds/${buildId}/edit`}>Edit</Link>
          <button className="btn-danger" onClick={openModal}>Delete</button>
           <dialog ref={dialogRef} className="confirm-dialog">
                    <h2>Are you sure?</h2>
                    <p>when you click delete this build will be deleted</p>
                    <div className="actions">
          <button onClick={handleDelete}>Delete</button>
                        <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
                    </div>
                </dialog>
        </div>
      )}

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentText}
          onChange={(evt) => setCommentText(evt.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Post comment</button>
      </form>

      {build.comment?.map((c) => (
        <div key={c._id}>
          <p>
            <strong>{c.author?.username}</strong>: {c.comment}
          </p>
          {c.author?._id === user?._id && (
            <button onClick={() => handleCommentDelete(c._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};
//
export default BuildDetails;


