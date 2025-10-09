"use client";
import FilterDropdown from '@/shared/Filter';
import React, {useState} from 'react'
import SearchBar from '../SearchBar'
import { BlogTable } from './BlogTable';
import { useQuery } from "@tanstack/react-query";
import { getPosts } from '@/services/blogService';

const Page = () => {

  const [filter, setFilter] = useState('')

  const {data, isLoading, error} = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (

      <div className="flex flex-col my-12 mx-6">
        <div id="title">
          <h1>QUẢN LÝ BÀI VIẾT BLOG</h1>
          <div className="flex justify-between items-end ">
            <div id="group__1" className='flex'>
              <h4>Admin</h4>
              <i className="ri-arrow-right-s-line"></i>
              <h4>QUẢN LÝ BÀI VIẾT BLOG</h4>
            </div>
          </div>
        </div>

        <SearchBar 
          placeholder = 'Tìm kiếm blog....'
          onSearch = {()=>{}}
          filterSlot = {
            <FilterDropdown 
            options={[]}
            value={filter} 
            onChange={setFilter}/>
          }
          />
        <BlogTable data={data ?? []} />
        </div>



  )
}

export default Page