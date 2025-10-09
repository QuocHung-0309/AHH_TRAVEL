'use client';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { GenericTable } from "@/shared/GenericTable"
import { Category } from '@/types/category';


interface Props {
    data: Category[]    
  }

export function CategoryTable({ data}: Props) {

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

    const columns = useMemo<ColumnDef<Category>[]>(() => [
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
          header: 'Danh mục',
          accessorKey: 'category',
          cell: ({row}) => {
            const category = row.original;
            return (
                <div className="flex flex-col">                     
                    <h2>{category.name}</h2>
                    <h4 className='!text-xs mt-1'>{category.checkinCount} lượt Checkin</h4>
                </div>
            )
          },
        },
        {
          header: 'Thứ tự',
          accessorKey: 'order',
          cell: ({ getValue }) => {      
            const value = getValue() as number;        
            return <span>{value}</span>
          },
        },
        {
          header: 'Trạng thái',
          accessorKey: 'status',
          cell: ({ getValue }) => {
            const value = getValue() as boolean;
            
            return <span className={value? "px-2 py-1 bg-[#E7F4EE] text-[#0D894F] rounded-xl":" px-2 py-1 bg-[#FBF0DC] text-[#FFC968] rounded-xl"}>{value? "Hiển thị": "Ẩn"}</span> 
          },
        },
        {
          header: 'Số địa điểm',
          accessorKey: 'destinationCount',
          cell: ({ getValue }) => {      
            const value = getValue() as number;        
            return <span>{value}</span>
          },
        },
        {
          header: "",
          accessorKey: 'action',
          cell: () => {
            return (
              <div className="flex gap-2">
                <button className="text-[#667085]"><i className="ri-eye-line"></i></button>
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