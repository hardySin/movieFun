// components/Comment.tsx
import React, { useEffect, useState } from 'react';
import {
  Send,
  Reply,
  Chat as CommentIcon,
  X as Close,
  Heart,
  HeartFill
} from 'react-bootstrap-icons';
import '../movieView/commentSection.css';
import { generateCreativeUsername } from '../service/randomGuest';
import TokenService from '../service/localStorage';
import firebase from '../service/firebase';
interface CommentProps {
  movieId: string;
}

const Comment: React.FC<CommentProps> = ({ movieId }) => {
  const CommentBy = "Commentby";
  const CommentId = "CommentId";
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [comment, setComment] = useState<string>('');
  const [replyComment, setReplyComment] = useState<string>('');
  const [currentCommentId, setCurrentCommentId] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [replies, setReplies] = useState<Map<string, any[]>>(new Map());
  const [commentLikes, setCommentLikes] = useState<Map<string, boolean>>(new Map());
  const [replyLikes, setReplyLikes] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState<string>('');

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const userId = TokenService.getToken(CommentId) || generateRandomId();
      if (!TokenService.getToken(CommentId)) {
        TokenService.setToken(CommentId, userId);
      }

      const { comments: fetchedComments, replies: fetchedReplies } =
        await firebase.getCommentsWithReplies(movieId);

      setComments(fetchedComments);
      setReplies(fetchedReplies);

      // Get user's like status
      const { commentLikes: userCommentLikes, replyLikes: userReplyLikes } =
        await firebase.getUserLikeStatus(movieId, userId);

      setCommentLikes(userCommentLikes);
      setReplyLikes(userReplyLikes);

    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleReply = (commentId: string) => {
    setCurrentCommentId(commentId);
    setShowReplyModal(true);
  };

  const handlePostComment = async () => {
    if (comment.trim()) {
      setLoading(true);
      try {
        const userId = TokenService.getToken(CommentId) || generateRandomId();
        const username = TokenService.getToken(CommentBy) || generateCreativeUsername();

        if (!TokenService.getToken(CommentBy)) {
          TokenService.setToken(CommentBy, username);
        }
        if (!TokenService.getToken(CommentId)) {
          TokenService.setToken(CommentId, userId);
        }

        await firebase.addComment(userId, username, movieId, comment);
        setComment('');
        fetchComments(); // Refresh comments
      } catch (error) {
        console.error("Error posting comment:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePostReply = async () => {
    if (replyComment.trim() && currentCommentId) {
      setReplyLoading(true);
      try {
        const userId = TokenService.getToken(CommentId) || generateRandomId();
        const username = TokenService.getToken(CommentBy) || generateCreativeUsername();

        if (!TokenService.getToken(CommentBy)) {
          TokenService.setToken(CommentBy, username);
        }
        if (!TokenService.getToken(CommentId)) {
          TokenService.setToken(CommentId, userId);
        }

        await firebase.addReply(currentCommentId, userId, username, movieId, replyComment);
        setReplyComment('');
        setShowReplyModal(false);
        fetchComments(); // Refresh comments and replies
      } catch (error) {
        console.error("Error posting reply:", error);
      } finally {
        setReplyLoading(false);
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setLikeLoading(commentId);
    try {
      const userId = TokenService.getToken(CommentId);
      if (!userId) {
        const newUserId = generateRandomId();
        TokenService.setToken(CommentId, newUserId);
        return;
      }

      const result = await firebase.toggleCommentLike(commentId, userId);

      // Update local state
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: result.likes, likedBy: result.liked ? [...(comment.likedBy || []), userId] : (comment.likedBy || []).filter((id: any) => id !== userId) }
          : comment
      ));

      setCommentLikes(prev => new Map(prev).set(commentId, result.liked));

    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setLikeLoading('');
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    setLikeLoading(replyId);
    try {
      const userId = TokenService.getToken(CommentId);
      if (!userId) {
        const newUserId = generateRandomId();
        TokenService.setToken(CommentId, newUserId);
        return;
      }

      const result = await firebase.toggleReplyLike(commentId, replyId, userId);

      // Update local state
      setReplies(prev => {
        const newReplies = new Map(prev);
        const commentReplies = newReplies.get(commentId) || [];
        const updatedReplies = commentReplies.map(reply =>
          reply.id === replyId
            ? { ...reply, likes: result.likes, likedBy: result.liked ? [...(reply.likedBy || []), userId] : (reply.likedBy || []).filter((id: any) => id !== userId) }
            : reply
        );
        newReplies.set(commentId, updatedReplies);
        return newReplies;
      });

      setReplyLikes(prev => new Map(prev).set(replyId, result.liked));

    } catch (error) {
      console.error("Error liking reply:", error);
    } finally {
      setLikeLoading('');
    }
  };

  const formatDate = (timestamp: Date) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-container">
      {/* Reply Modal */}
      {showReplyModal && (
        <div className="comment-modal-overlay">
          <div className="comment-modal">
            <div className="comment-modal-header">
              <h3 className="comment-modal-title">Reply to Comment</h3>
              <button
                className="comment-modal-close"
                onClick={() => setShowReplyModal(false)}
              >
                <Close />
              </button>
            </div>
            <div className="comment-modal-content">
              <textarea
                className="comment-modal-textarea"
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
              />
            </div>
            <div className="comment-modal-actions">
              <button
                className="comment-modal-cancel"
                onClick={() => setShowReplyModal(false)}
              >
                Cancel
              </button>
              <button
                className="comment-modal-submit"
                onClick={handlePostReply}
                disabled={!replyComment.trim() || replyLoading}
              >
                <Send className="comment-modal-icon" />
                {replyLoading ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Input */}
      <div className="comment-input-section">
        <h3 className="comment-section-title">
          <CommentIcon className="comment-title-icon" />
          Leave a comment
        </h3>

        <div className="comment-input-container">
          <textarea
            className="comment-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={2}
          />
          <button
            className="comment-submit-btn"
            onClick={handlePostComment}
            disabled={!comment.trim() || loading}
          >
            <Send className="comment-submit-icon" />
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      <div className="comment-divider"></div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="comment-empty-message">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div className="comment-card" key={comment.id}>
              <div className="comment-content">
                <div className="comment-avatar-container">
                  <div className="comment-avatar">
                    {comment.userName?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="comment-details">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userName}</span>
                    <span className="comment-date">{formatDate(comment.timing)}</span>
                  </div>
                  <p className="comment-text">{comment.userComment}</p>

                  <div className="comment-actions">
                    <button
                      className={`comment-like-btn ${commentLikes.get(comment.id) ? 'liked' : ''}`}
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={likeLoading === comment.id}
                    >
                      {commentLikes.get(comment.id) ? (
                        <HeartFill className="comment-like-icon" />
                      ) : (
                        <Heart className="comment-like-icon" />
                      )}
                      <span>{comment.likes}</span>
                    </button>

                    <button
                      className="comment-reply-btn"
                      onClick={() => handleReply(comment.id)}
                    >
                      <Reply className="comment-reply-icon" />
                      Reply ({comment.replies})
                    </button>
                  </div>

                  {/* Replies */}
                  {replies.get(comment.id)?.map((reply) => (
                    <div className="reply-card" key={reply.id}>
                      <div className="reply-avatar-container">
                        <div className="reply-avatar">
                          {reply.userName?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="reply-details">
                        <div className="reply-header">
                          <span className="reply-author">{reply.userName}</span>
                          <span className="reply-date">{formatDate(reply.timing)}</span>
                        </div>
                        <p className="reply-text">{reply.userComment}</p>
                        <button
                          className={`reply-like-btn ${replyLikes.get(reply.id) ? 'liked' : ''}`}
                          onClick={() => handleLikeReply(comment.id, reply.id)}
                          disabled={likeLoading === reply.id}
                        >
                          {replyLikes.get(reply.id) ? (
                            <HeartFill className="reply-like-icon" />
                          ) : (
                            <Heart className="reply-like-icon" />
                          )}
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function
const generateRandomId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default Comment;