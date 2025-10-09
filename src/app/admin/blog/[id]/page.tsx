"use client";
import CustomDropdown from "@/shared/CustomDropdown";
import { MultiSelect } from "@/shared/MultiSelect";
import { useState, use } from "react";
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categoryService';
import { getPostById } from '@/services/blogService';


interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogDetail({params}:Props) {
  const { id } = use(params);
  const {data:post, isLoading: postLoading, error: postError} = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  })
  const [status, setStatus] = useState(`${post?.categories[0]}`);
  const [status01, setStatus01] = useState("APPROVED");

  const [selectedTags, setSelectedTags] = useState<string[]>(post?.tags ?? []);
  const statusOptions = [ "APPROVED" , "DELETED" , "PENDING"]
  
  const {data:categories = []} = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,  
  })

  const [form, setForm] = useState({
    title: post?.title ?? "",
    content: post?.content ?? "",
    status: post?.status ?? "pending",
    category: post?.categories ?? [],
    tags: post?.tags ?? [],
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (postLoading) return <div>Loading...</div>;
  if (postError) return <div>Some thing went wrong</div>;

    return (      
        <div className="flex flex-col">
          <div id="title">
            <h1>CHI TIẾT BÀI VIẾT</h1>
            <div className="flex justify-between items-end ">
              <div id="group__1" className='flex'>
                <h4 className='text-(--primary)'>Admin</h4>
                <i className="ri-arrow-right-s-line"></i>
                <h4 className='text-(--primary)'>Quản lý bài đăng</h4>
                <i className="ri-arrow-right-s-line"></i>
                <h4>Chi tiết bài đăng</h4>


              </div>
              <div id="group__btn" className='gap-2 flex'>
                <button className=' flex bg-[#DEDEFA] text-(--primary) gap-2 p-2 rounded-md'>
                  <i className="ri-close-line"></i>
                  <h4>Huỷ</h4>
                </button>
                <button className="flex btn-primary text-white gap-2 p-2 rounded-md">
                  <i className="ri-folder-4-line"></i>
                  <h4>Duyệt bài viết</h4>
                </button>
              </div>
            </div>
          </div>

          <div className="grid items-start grid-cols-[75%_25%]">
            <div id="grid__1">
              <div id="content__container" className='flex flex-col'>
                  <div id="container__1" className='border border-gray-300 rounded-md bg-white p-4 mt-8'>
                    <h1>THÔNG TIN BÀI ĐĂNG</h1>
                    <div id="content__title" className='flex flex-col mt-4 text-[#4D5464] '>
                        <h4>Tiêu đề</h4>
                        <input type="text" value={post?.title} onChange={handleChange} className='border border-gray-300 rounded-md p-2 text-lg uppercase bg-[#F9F9FC] '/>
                    </div>
                    <div id="content__main" className='flex flex-col mt-4 text-[#4D5464] '>
                        <h4>Nội dung</h4>
                        <textarea rows={10} value={post?.content.map(c => c.value).join("\n") || ""} onChange={handleChange} className='border border-gray-300 rounded-md p-2 text-base bg-[#F9F9FC]'/>
                    </div>
                  </div>
              </div>
              <div id="media__container" className='flex flex-col'>
                <div id="container__1" className='border border-gray-300 rounded-md bg-white p-4 mt-8'>
                  <h1>PHƯƠNG TIỆN</h1>
                  <div id="content__title" className='flex flex-col mt-4 text-[#4D5464] '>
                      <h4>Hình ảnh</h4>
                      <div id="img__container" className='bg-[] border border-dashed border-gray-300 rounded-md flex justify-center items-center gap-2 p-4'>
                        {post?.album
                        ?.filter((img) => img.type === "image")
                        .map((img, index)=> (
                          <div className="relative" key={index} >
                            <i className=" absolute ri-check-line rounded-full p-1 flex justify-center items-center top-1 right-1 text-[#0D894F] bg-[#CFE7DC] h-4 w-4 text-xs font-bold"></i>
                            <img src={img.url} alt="" className='h-20 w-20 object-cover rounded-xl'/>

                          </div> 
                          ))
                        }
                      </div>
                  </div>
                  <div id="content__main" className='flex flex-col mt-4 text-[#4D5464] '>
                      <h4>Video</h4>
                      <div id="img__container" className='bg-[] border border-dashed border-gray-300 rounded-md flex justify-center items-center gap-2 p-4'>
                        <div className="relative">
                          <i className=" absolute ri-check-line rounded-full p-1 flex justify-center items-center top-1 right-1 text-[#0D894F] bg-[#CFE7DC] h-4 w-4 text-xs font-bold"></i>
                          <video src={post?.album?.find((media) => media.type === "video")?.url} controls className='h-30 w-45 object-cover rounded-xl'></video>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="grid__2" className='mt-8 ml-6'>
              <div id="category__container" className='border border-gray-300 rounded-md p-2 shadow-[0px_1.5px_2px_0px_#1018281A]'>
                <h1>DANH MỤC</h1>
                <div className='flex flex-col mt-4 text-[#4D5464] '>
                  <h4>Danh mục</h4>
                  <CustomDropdown options={categories.map((category) => category.name)} value={status} onChange={setStatus}/>
                </div>

                <div className='flex flex-col mt-4 text-[#4D5464] '>
                  <h4>Tags</h4>
                  <MultiSelect
                    options={categories.map((category) => category.name)}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    getLabel={(option) => option}
                  />
                </div>
              </div>

              <div id="group__2" className='border border-gray-300 p-2 mt-4 rounded-md shadow-[0px_1.5px_2px_0px_#1018281A] '>
                <div className="flex flex-col lg:flex-row justify-between items-center">
                  <h1>TÌNH TRẠNG</h1>
                  <div className="px-2 py-1 bg-[#E7F4EE] text-[#0D894F] rounded-xl font-bold items-center">
                    {post?.categories[0]}
                  </div>
                </div>
                <h4>Tình trạng bài viết</h4>
                <div className="flex justify-between mt-4 ">
                  <CustomDropdown className='w-full' options={statusOptions} value={status01} onChange={setStatus01}/>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
} 