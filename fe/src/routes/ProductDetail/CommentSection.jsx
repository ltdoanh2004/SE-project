import React, { useState, useEffect } from "react";
import { FaReply, FaThumbsUp } from "react-icons/fa";
import anonymousAvatar from "../../assets/image/avatar.png";
import axios from "axios";
import timeAgo from "./timeAgo";

const CommentItem = ({ commentData, onLike, onReplySubmit }) => {
  const { id, name, createdAt, comment, imgUrl, likes, replies } = commentData;
  const [timeString, setTimeString] = useState(timeAgo(createdAt));
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyInput, setReplyInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(timeAgo(createdAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const handleReply = () => {
    if (!replyInput.trim()) return;
    onReplySubmit(id, replyInput.trim());
    setReplyInput("");
    setShowReplyInput(false);
  };

  return (
    <div className="w-full pb-6 border-b border-gray-300 flex flex-col gap-3.5">
      <div className="flex items-start gap-3.5">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={imgUrl || anonymousAvatar}
          alt={name}
        />
        <div className="flex flex-col w-full gap-3.5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <h5 className="text-gray-900 text-sm font-semibold">{name}</h5>
              <span className="text-gray-500 text-xs">{timeString}</span>
            </div>
            <p className="text-gray-800 text-sm">{comment}</p>
          </div>

          {/* Nút Trả lời và Thích */}
          <div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out"
            >
              <FaReply className="text-base" />
              Trả lời
            </button>
            <button
              onClick={() => onLike(id)}
              className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out"
            >
              <FaThumbsUp className="text-base" />
              {likes > 0 ? `Thích (${likes})` : "Thích"}
            </button>
          </div>

          {/* Input Trả lời */}
          {showReplyInput && (
            <div className="flex flex-col gap-2 mt-2">
              <textarea
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                rows="2"
                placeholder="Phản hồi..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 resize-none focus:outline-none text-gray-800"
              ></textarea>
              <button
                onClick={handleReply}
                className="self-start px-4 py-2 bg-[rgba(242,219,169,1)] rounded-xl text-black font-semibold hover:opacity-90"
              >
                Gửi
              </button>
            </div>
          )}

          {/* Hiển thị reply */}
          {replies.length > 0 && (
            <div className="pl-10 flex flex-col gap-4 mt-4">
              {replies.map((reply, idx) => (
                <div key={idx} className="flex gap-3.5 items-start">
                  <img
                    src={anonymousAvatar}
                    alt="Reply User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="bg-gray-100 p-3 rounded-xl text-gray-800 text-sm">
                    {reply}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = () => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/comments?_limit=3");
      const fakeData = res.data.map((item, idx) => ({
        id: idx + 1,
        name: item.name.split(" ")[0],
        comment: item.body,
        createdAt: new Date().toISOString(),
        imgUrl: "",
        likes: 0,
        replies: [],
      }));
      setComments(fakeData);
    } catch (error) {
      console.error("Lỗi lấy comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePostComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      name: "Bạn",
      comment: commentInput.trim(),
      createdAt: new Date().toISOString(),
      imgUrl: "",
      likes: 0,
      replies: [],
    };
    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  const handleLike = (id) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  const handleReplySubmit = (parentId, replyText) => {
    setComments(
      comments.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, replyText] } : c
      )
    );
  };

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex flex-col gap-14">
          <h2 className="text-gray-900 text-4xl font-bold">Bình Luận</h2>

          {/* Form nhập comment */}
          <div className="w-full flex flex-col gap-5">
            <div className="w-full rounded-3xl flex gap-3.5">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={anonymousAvatar}
                alt="User Avatar"
              />
              <textarea
                rows="5"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
                className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow resize-none focus:outline-none placeholder-gray-400 text-gray-900 text-lg"
                placeholder="Chia sẻ ý kiến của bạn ở đây..."
              ></textarea>
            </div>
            <button
              onClick={handlePostComment}
              className="self-start px-5 py-2.5 bg-[rgba(242,219,169,1)] hover:opacity-90 transition-all rounded-xl text-black font-semibold"
            >
              Đăng bình luận của bạn
            </button>
          </div>

          {/* Danh sách comments */}
          <div className="w-full flex flex-col gap-8">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                commentData={comment}
                onLike={handleLike}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
