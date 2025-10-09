"use client";
import React from 'react'
import SearchBar from '../SearchBar'
import { useQuery } from "@tanstack/react-query";
import { CategoryTable } from './CategoryTable';
import {useState} from 'react'
import AddCategoryPopup from './AddCategoryPopup'
import FilterDropdown from '@/shared/Filter';
import { getCategories } from '@/services/categoryService';

export default function CategoriesPage() {

  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  
  const {data, isLoading, error} = useQuery({
    queryKey: ["categories"],
    queryFn:getCategories,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <>
    {isOpen && <AddCategoryPopup onClose={()=>setIsOpen(false)}/>}
      <div className="flex flex-col my-12 mx-6">
        <div id="title">
          <h1>QUẢN LÝ DANH MỤC</h1>
          <div className="flex justify-between items-end ">
            <div id="group__1" className='flex'>
              <h4>Admin</h4>
              <i className="ri-arrow-right-s-line"></i>
              <h4>QUẢN LÝ DANH MỤC</h4>
            </div>
            <div id="group__btn" className='gap-2 flex'>
              <button className=' flex bg-[#DEDEFA] text-(--primary) gap-2 p-2 rounded-md'>
                <i className="ri-upload-cloud-line"></i>
                <h4>Xuất file</h4>
              </button>
              <button onClick={()=> setIsOpen(true)} className="flex btn-primary text-white gap-2 p-2 rounded-md">
                <i className="ri-add-line"></i>
                <h4>Thêm Danh mục</h4>
              </button>
            </div>
          </div>
        </div>

        <SearchBar 
          placeholder = 'Tìm kiếm danh mục....'
          onSearch = {()=>{}}
          filterSlot={
            <FilterDropdown
            options={['Trạng thái hiện thị','Số địa điểm nhiều nhất','Số địa điểm ít nhất','Đã ẩn']}
            value={filter}
            onChange={setFilter}
            />
          }
          />

        <CategoryTable data={data??[]}/>
      </div>
    </>

  )
}

