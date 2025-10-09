"use client";
import FilterDropdown from '@/shared/Filter';
import React, {useState} from 'react'
import SearchBar from '../SearchBar'
import { UserTable, } from './UserTable';
import { useQuery } from "@tanstack/react-query";
import { getUsers } from '@/services/userService';


const UsersPage = () => {

  const [filter, setFilter] = useState('')

  const {data, isLoading, error} = useQuery({
    queryKey: ["users"],
    queryFn: getUsers, 
   })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (

      <div className="flex flex-col my-12 mx-6">
        <div id="title">
          <h1>QUẢN LÝ NGƯỜI DÙNG</h1>
          <div className="flex justify-between items-end ">
            <div id="group__1" className='flex mt-2'>
              <h4 className='text-(--primary)'>Admin</h4>
              <i className="ri-arrow-right-s-line"></i>
              <h4>QUẢN LÝ NGƯỜI DÙNG</h4>
            </div>
          </div>
        </div>

        <SearchBar 
          placeholder = 'Tìm kiếm tài khoản...'
          onSearch = {()=>{}}
          filterSlot={
            <FilterDropdown
            options={[]}
            value={filter}
            onChange={setFilter}/>
          }
          />
        <UserTable data={data || []} />
        </div>
  )
}

export default UsersPage