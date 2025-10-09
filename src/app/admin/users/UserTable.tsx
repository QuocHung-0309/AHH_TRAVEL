'use client'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter } from "next/navigation";
import { useMemo, useState } from 'react'
import { GenericTable } from "@/shared/GenericTable"
import {User} from '@/types/user'


interface Props {
    data: User[]    
  }

export function UserTable({ data}: Props) {

    const router = useRouter();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const toggleSelect = (id: string) => {
      setSelectedIds(prev => {
        const newSet = new Set(prev)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        return newSet
      })
    }    
    
    const toggleSelectAll = () => {
      if (selectedIds.size === data.length) setSelectedIds(new Set())
      else setSelectedIds(new Set(data.map(d => d.id)))
    }

    const columns = useMemo<ColumnDef<User>[]>(() => [
      {
          id: 'select',
          header: () => (
            <input
              type="checkbox"
              checked={selectedIds.size === data.length && data.length > 0}
              onChange={toggleSelectAll}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={selectedIds.has(row.original.id)}
              onChange={() => toggleSelect(row.original.id)}
            />
          ),
      },
      {
          header: 'Tên Tài khoản',
          accessorKey: 'username',
          cell: ({row}) => {
              const user = row.original;
              return (
                  <div className="flex gap-2">
                      <img src={user?.avatar || 'https://i.pinimg.com/1200x/e1/1e/07/e11e07774f7fc24da8e03e769a0f0573.jpg'} alt="" className='h-6 w-6 object-cover rounded-full'/>
                      <h2 className='clamp-1'>{user.firstName+user.lastName}</h2>
                  </div>
              )
          },
      },
      {
          header: 'Email',
          accessorKey: 'email',
          cell: ({ getValue }) => {
              const value = getValue() as string;
              return <span className='clamp-1'>{value}</span>;
            }
        },
        {
          header: 'Số bài viết',
          accessorKey: 'postCount',
          cell: ({ getValue }) => {
            const value = getValue() as number;
            return <span>{value}</span>
          },
        },
        {
          header: 'Số đánh giá',
          accessorKey: 'reviewCount',
          cell: ({ getValue }) => {
              const value = getValue() as number;
            return <span>{value}</span>
          },
        },
        {
          header: 'Trạng thái',
          accessorKey: 'banned',
          cell: ({ getValue }) => {
            const value = getValue() as boolean;
            
            return <span className={!value? "px-2 py-1 bg-[#E7F4EE] text-[#0D894F] rounded-xl font-bold":" px-2 py-1 bg-[#FBF0DC] text-[#FFC968] rounded-xl font-bold"}>{!value? "Hoạt động": "Bị khoá"}</span> 
          },
        },
        {
          header: 'Ngày tạo',
          accessorKey: 'createdAt',
          cell: ({ getValue }) => {
            const date = new Date(getValue() as string)
            return <span className='text-[#667085]'>{date.toLocaleDateString('vi-VN')}</span>
          },
        },  
        {
          header: "",
          accessorKey: 'action',
          cell: ({ row }) => {
            const user = row.original;
            return (
              <div className="flex gap-2">
                <button onClick={() => router.push(`users/${user.id}`)} className="text-[#667085]"><i className="ri-eye-line"></i></button>
                <button className="text-[#667085]"><i className="ri-pencil-line"></i></button>
                <button className="text-[#667085]"><i className="ri-delete-bin-6-line"></i></button>
              </div>
            );
          },
        },
      ], [selectedIds, data])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        })

    return (
        <div className="[&>div]:!border-0 [&>div]:!shadow-none [&>div]:!rounded-none">
            <GenericTable data={data} columns={columns} />
        </div>       
        )
}