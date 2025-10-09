'use client'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { GenericTable } from "@/shared/GenericTable"
// import {Destination, destinations} from "../../assets/data/destinations";
import {Destination} from '@/types/destination';



interface Props {
    data: Destination[]    
  }


export function DestinationTable({ data}: Props) {

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


    const columns = useMemo<ColumnDef<Destination>[]>(() => [
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
            header: 'Địa điểm',
            accessorKey: 'title',
            cell: ({row}) => {
                const destination = row.original;
                return (
                    <div className="flex gap-3">
                        {/* <img src={destination.images} alt="" className='h-10 w-10 object-cover rounded-md'/> */}
                        <h2 className='clamp-1'>{destination.name}</h2>
                    </div>
                )
            },
        },
        {
            header: 'Danh mục',
            accessorKey: 'categories',
            cell: ({ getValue }) => {
                const value = getValue() as { name: string }[] | undefined;
                return <span className='clamp-1'>
                  {value && value.length > 0
                  ? value.map(v => v.name).join(', ')
                  : '—'}
          </span>;
              }
          },
          {
            header: 'Toạ độ',
            accessorKey: 'location',
            cell: ({ getValue }) => {
              const value = getValue() as { type: string; coordinates: number[] };
              const coordStr = `${value.coordinates[1].toFixed(4)}, ${value.coordinates[0].toFixed(4)}`; // lat, lng
              return <span className='clamp-1'>{coordStr}</span>;
            },
          },
          // {
          //   header: 'Toạ độ',
          //   accessorKey: 'location',
          //   cell: ({ getValue }) => {
          //     const value = getValue() as { type: string; coordinates: number[] } | null | undefined;
          //     return <span>{value && value.coordinates?.length ? 'Có' : 'Không'}</span>;
          //   },
          // },
          
          // {
          //   header: 'Trạng thái',
          //   accessorKey: 'status',
          //   cell: ({ getValue }) => {
          //     const value = getValue() as string;
          //     return <span className='clamp-1'>{value}</span>;
          //   },
          // },
                
        {
          header: 'Trạng thái',
          accessorKey: 'status',
          cell: ({ getValue }) => {
            type Status = "approved"  | "deleted"  | "pending";
            const value = getValue() as Status;
            const statusMap: Record<
              Status,
              { label: string; className: string }
            > = {
              approved: {
                label: "Đã duyệt",
                className: "px-2 py-1 bg-[#E7F4EE] text-[#0D894F] rounded-xl font-bold"
              },
              deleted: {
                label: "Đã xoá",
                className: "px-2 py-1 bg-[#FBF0DC] text-[#FFC968] rounded-xl font-bold"
              },
              pending: {
                label: "Chờ duyệt",
                className: "px-2 py-1 bg-[#E5E9F2] text-[#3B82F6] rounded-xl font-bold"
              }
            };

            const status = statusMap[value] ?? {
              label: "Không xác định",
              className: "px-2 py-1 bg-gray-200 text-gray-600 rounded-xl font-bold"
            };

            return <span className={status.className}>{status.label}</span>;
            // return <span className={value? "px-2 py-1 bg-[#E7F4EE] text-[#0D894F] rounded-xl font-bold":" px-2 py-1 bg-[#FBF0DC] text-[#FFC968] rounded-xl font-bold"}>{value? "Hoạt động": "Bị khoá"}</span> 
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