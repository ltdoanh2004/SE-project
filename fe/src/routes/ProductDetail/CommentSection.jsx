import React, { useState } from "react";
import { FaReply, FaThumbsUp } from "react-icons/fa";
import anonymousAvatar from "../../assets/image/avatar.png";

const CommentItem = ({ name, time, comment, imgUrl }) => {
  return (
    <div className="w-full pb-6 border-b border-gray-300 flex items-start gap-3.5">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={imgUrl || anonymousAvatar}
        alt={name}
      />
      <div className="flex flex-col w-full gap-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <h5 className="text-gray-900 text-sm font-semibold">{name}</h5>
            <span className="text-gray-500 text-xs">{time}</span>
          </div>
          <p className="text-gray-800 text-sm">{comment}</p>
        </div>

        {/* Nút Trả lời và Thích */}
        <div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
          <button className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out">
            <FaReply className="text-base" />
            Trả lời
          </button>
          <button className="flex items-center gap-1 hover:text-[rgba(242,219,169,1)] transition-all duration-200 ease-in-out">
            <FaThumbsUp className="text-base" />
            Thích
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentSection = () => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    {
      name: "Thành Nam",
      time: "12 giờ trước",
      comment: "Sản phẩm tuyệt vời, chất lượng rất tốt!",
      imgUrl: "",
    },
    {
      name: "Hữu Hoài",
      time: "2 ngày trước",
      comment: "Rất thích thiết kế tinh tế, chắc chắn sẽ mua thêm.",
      imgUrl: "",
    },
    {
      name: "Thiên Trường",
      time: "5 ngày trước",
      comment: "Giá cả hợp lý, giao hàng nhanh chóng.",
      imgUrl: "",
    },
  ]);

  const handlePostComment = () => {
    if (!commentInput.trim()) return;

    const newComment = {
      name: "Bạn", 
      time: "vừa xong",
      comment: commentInput.trim(),
      imgUrl: "", 
    };

    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex flex-col gap-14">
          <h2 className="text-gray-900 text-4xl font-bold">Comments</h2>

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
  placeholder="Write your thoughts here..."
></textarea>

            </div>
            <button
              onClick={handlePostComment}
              className="self-start px-5 py-2.5 bg-[rgba(242,219,169,1)] hover:opacity-90 transition-all rounded-xl text-black font-semibold"
            >
              Post your comment
            </button>
          </div>

          {/* Danh sách comments */}
          <div className="w-full flex flex-col gap-8">
            {comments.map((comment, index) => (
              <CommentItem
                key={index}
                name={comment.name}
                time={comment.time}
                comment={comment.comment}
                imgUrl={comment.imgUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
