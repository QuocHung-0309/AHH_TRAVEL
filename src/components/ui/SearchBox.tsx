"use client";

import React from "react";
import {
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCalendarAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa";

const SearchBox = () => {
  return (
    <div className="pointer-events-none relative z-20 -mt-14 flex justify-center px-4">
      {/* Container có blur nhẹ để nổi trên ảnh */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="
          pointer-events-auto
          w-full max-w-5xl
          h-16
          bg-white/90 backdrop-blur
          rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]
          ring-1 ring-black/5
          flex items-center
          px-2
        "
      >
        <Field icon={<FaMapMarkerAlt />} placeholder="Bạn muốn đến đâu?" />
        <Divider />
        <Field icon={<FaPaperPlane />} placeholder="Nơi khởi hành" />
        <Divider />
        <Field type="date" icon={<FaCalendarAlt />} placeholder="Ngày đi" />
        <Divider />
        <Field type="number" min={1} defaultValue={1} icon={<FaUser />} placeholder="Số khách" />

        {/* CTA tách rời, nổi bật nhưng gọn */}
        <button
          type="submit"
          className="
            ml-2 h-12 px-5
            rounded-full
            bg-neutral-900 text-white text-sm font-semibold
            flex items-center gap-2
            shadow-[0_6px_18px_-6px_rgba(0,0,0,0.5)]
            hover:bg-black/90 active:scale-[0.99]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            transition
          "
        >
          <FaSearch className="-ml-1" />
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  placeholder?: string;
};

const Field = ({ icon, placeholder, className, ...rest }: FieldProps) => {
  // render type=date kiểu text để placeholder vẫn hiện; khi focus đổi sang date (trick UI)
  const inputRef = React.useRef<HTMLInputElement>(null);
  const onFocus = () => {
    if (rest.type === "date" && inputRef.current) inputRef.current.type = "date";
  };
  const onBlur = () => {
    if (rest.type === "date" && inputRef.current && !inputRef.current.value) {
      inputRef.current.type = "text";
    }
  };

  return (
    <div
      className="
        group flex-1 min-w-[140px]
        flex items-center gap-2 px-4 h-12
        rounded-full
        hover:bg-black/[0.04]
        focus-within:bg-black/[0.04]
        transition
      "
    >
      <span className="text-neutral-500">{icon}</span>
      <input
        ref={inputRef}
        aria-label={placeholder}
        placeholder={placeholder}
        {...rest}
        type={rest.type === "date" ? "text" : rest.type} // để placeholder hiển thị cho date
        onFocus={onFocus}
        onBlur={onBlur}
        className={`
          w-full bg-transparent text-[0.95rem] text-neutral-800 placeholder:text-neutral-400
          focus:outline-none
          ${className || ""}
        `}
      />
    </div>
  );
};

const Divider = () => (
  <div className="hidden md:block h-8 w-px bg-neutral-200" />
);

export default SearchBox;
