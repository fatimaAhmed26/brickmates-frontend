import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import * as buildService from '../services/build';
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

  if (!build) return <p className="page-loading">Loading...</p>;

  const isOwner = build.owner?._id === user?._id;
  const isLiked = build.like?.includes(user?._id);

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
    <div className="build-details-page">
      <div className="build-details-card">
        <div className="build-details-media">
          {build.image?.url ? (
            <img src={build.image.url} alt={build.caption} />
          ) : (
            <div className="build-details-media-placeholder">No image</div>
          )}
        </div>

        <div className="build-details-panel">
          <Link to={`/profile/${build.owner?._id}`} className="build-details-owner-row">
            <img
              className="build-details-owner-avatar"
              src={build.owner?.avatar || 'https://placehold.co/40x40?text=%20'}
              alt={build.owner?.username}
            />
            <div>
              <p className="build-details-owner-name">{build.owner?.username}</p>
              <p className="build-details-owner-sub">Time taken: {build.timeTaken} min</p>
            </div>
          </Link>

          <div className="build-details-tags">
            {build.theme && <span className="tag tag-theme">{build.theme}</span>}
            <span className="tag tag-type">{build.isMOC ? 'MOC' : 'Official set'}</span>
            <span className={`tag tag-status ${build.status === 'completed' ? 'tag-status-done' : ''}`}>
              {build.status}
            </span>
          </div>

          <p className="build-details-caption">{build.caption}</p>

          <div className="build-actions">
            <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
              {isLiked ? '♥' : '♡'} {build.like?.length || 0}
            </button>

            {isOwner && (
              <div className="owner-actions">
                <Link to={`/builds/${buildId}/edit`}>
                  <button className="btn-secondary">Edit</button>
                </Link>
                <button className="btn-danger" onClick={openModal}>Delete</button>
              </div>
            )}
          </div>

          <dialog ref={dialogRef} className="confirm-dialog">
            <h2>Are you sure?</h2>
            <p>When you click delete this build will be deleted</p>
            <div className="actions">
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
              <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </dialog>

          <div className="comments-section">
            <h3 className="comments-title">
              Comments {build.comment?.length ? `· ${build.comment.length}` : ''}
            </h3>

            <div className="comments-list">
              {build.comment?.length ? build.comment.map((c) => (
                <div className="comment-item" key={c._id}>
                  <img
                    className="comment-avatar"
                    src={c.author?.avatar || 'https://placehold.co/32x32?text=%20'}
                    alt={c.author?.username}
                  />
                  <div className="comment-content">
                    <p className="comment-text">
                      <span className="comment-username">{c.author?.username}</span>
                      {' '}{c.comment}
                    </p>
                  </div>
                  {c.author?._id === user?._id && (
                    <button className="comment-delete" onClick={() => handleCommentDelete(c._id)}>✕</button>
                  )}
                </div>
              )) : (
                <p className="comments-empty">No comments yet — be the first to say something.</p>
              )}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <img
                className="comment-avatar"
                src={user?.avatar || 'https://placehold.co/32x32?text=%20'}
                alt={user?.username}
              />
              <input
                type="text"
                value={commentText}
                onChange={(evt) => setCommentText(evt.target.value)}
                placeholder="Add a comment..."
                required
              />
              <button type="submit" disabled={!commentText.trim()}>Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDetails;