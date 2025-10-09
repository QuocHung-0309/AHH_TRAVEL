'use client';

import Image from 'next/image';
import { IoFlagSharp } from 'react-icons/io5';
import { AiFillLike } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { BlogComment } from '@/types/blogComment';
import { blogCommentApi } from '@/lib/blogComment/blogCommentApi';
import { FiX } from 'react-icons/fi';

type CommentCardProps = {
  comment: BlogComment;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const [likes, setLikes] = useState(comment.totalLikes || 0);
  const [liked, setLiked] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (currentUserId && comment.likeBy.includes(currentUserId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikes(comment.totalLikes);
  }, [comment, currentUserId]);
  
  const handleLike = async () => {
    try {
      const updated = await blogCommentApi.likeComment(comment._id);
      setLikes(updated.totalLikes);
      if (currentUserId) {
        setLiked(updated.likeBy.includes(currentUserId));
      }
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  return (
    <>
    <div className="relative border-b border-[var(--gray-2)] py-4 flex flex-col gap-2">
      <button
        className="cursor-pointer absolute right-0 top-0 p-2 text-[var(--gray-2)] hover:text-[var(--gray-1)]"
        title="Báo cáo đánh giá"
      >
        <IoFlagSharp size={18} />
        </button> 
        {/* HiOutlineDotsVertical  */} {/* menu để xóa, sửa comment */}
      <button
        onClick={handleLike}
        className="cursor-pointer absolute right-8 top-0 p-2 flex items-center gap-1 text-[var(--gray-2)] hover:text-[var(--gray-1)]"
        title="Yêu thích"
      >
        <AiFillLike size={18} className={liked ? "text-[var(--primary)]" : ""}/>
        <span className="text-sm">{likes}</span>
      </button>

      {/* Nội dung đánh giá */}
      <div className="flex items-start gap-3 pr-8"> 
        <div className="relative size-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={comment.userId?.avatar || "/Logo.svg"}
            alt={comment.userId?.firstName || "Ẩn danh"}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold pr-12">
            {comment.userId?.firstName || "Ẩn danh"} {comment.userId?.lastName || ""}
          </p>
          <p className="text-sm text-[var(--gray-2)] whitespace-pre-line">{comment.comment}</p>
          {comment.images && comment.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {comment.images.map((url, idx) => (
                <div key={idx} className="relative w-30 h-30 rounded overflow-hidden cursor-pointer hover:opacity-80 transition" onClick={() => setPopupImage(url)}>
                  <Image
                    src={url}
                    alt={`comment image ${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {popupImage && (
        <div 
          className="fixed inset-0 w-screen h-screen bg-black/20 backdrop-blur-xs flex items-center justify-center z-50"
          // onClick={() => setPopupImage(null)}
        >
          <div 
            className="relative w-[90%] max-w-3xl h-[80%]"
            onClick={(e) => e.stopPropagation()} // tránh click vào ảnh cũng đóng
          >
            <Image
              src={popupImage}
              alt="Popup image"
              fill
              className="object-contain max-h-[80vh] rounded-lg"
            />
          </div>
          <button
              className="absolute top-7 right-10 bg-black/50 text-white rounded-full p-2 hover:bg-black transition"
              onClick={() => setPopupImage(null)}
            >
              <FiX size={20} />
            </button>
        </div>
      )}
    </>
  );
};

export default CommentCard;
