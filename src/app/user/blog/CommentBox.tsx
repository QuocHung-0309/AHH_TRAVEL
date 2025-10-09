'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { blogCommentApi } from '@/lib/blogComment/blogCommentApi';
import { FaRegImage } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';

type CommentBoxProps = {
  blogId: string;
  onCommentAdded?: (comment: any) => void; // callback để update list
};

const CommentBox = ({ blogId, onCommentAdded }: CommentBoxProps) => {
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!comment.trim() && images.length === 0) return;

    try {
      setLoading(true);
      const newComment = await blogCommentApi.createComment(blogId, comment, images);
      setComment('');
      setImages([]);
      if (onCommentAdded) onCommentAdded(newComment); // cập nhật list
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12">
      <div className="relative">
        <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bạn đang nghĩ gì!"
        className="w-full h-[60px] p-4 shadow-lg resize-none text-sm focus:outline-none bg-[var-white]"
        />
        <label className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer">
            <FaRegImage className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-30 h-30 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 cursor-pointer"
              >
                <FiX className="text-white w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Đang gửi...' : 'Bình luận'}
        </Button>
      </div>
    </div>
  );
};

export default CommentBox;
