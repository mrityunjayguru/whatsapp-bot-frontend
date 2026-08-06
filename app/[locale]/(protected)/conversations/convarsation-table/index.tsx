"use client"

import * as React from "react"

import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
} from "@tanstack/react-table"



import { columns, DataProps } from "./columns"
import { apisericecon } from "./apiservice"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import TablePagination from "./table-pagination"


function statusFilterFn(
    row: Row<DataProps>,
    columnId: string,
    filterValue: string
) {
    if (!filterValue || filterValue === "all") return true

    return row.getValue(columnId) === filterValue
}



const ConversationTable = () => {


    const [conversationData,setConversationData] =
        React.useState<DataProps[]>([])


    const [loading,setLoading] =
        React.useState(true)



    const [sorting,setSorting] =
        React.useState<SortingState>([])


    const [columnFilters,setColumnFilters] =
        React.useState<ColumnFiltersState>([])


    const [columnVisibility,setColumnVisibility] =
        React.useState<VisibilityState>({})


    const [rowSelection,setRowSelection] =
        React.useState({})





    // API CALL ONLY ONE TIME WHEN PAGE LOADS

    React.useEffect(()=>{


        async function loadConversation(){


            try{


                const response =
                    await apisericecon()



                console.log(
                    "Conversation API Response:",
                    response
                )



                const apiData =
                    response?.body ??
                    response?.data ??
                    response ??
                    []


                    console.log("===========apiData===========");
                    console.log(apiData);
                    console.log("===========apiData===========");



                const formattedData =
                    apiData.map(
                        (item:any,index:number):DataProps=>({

                            id:
                                item.id ??
                                index + 1,


                            conversationNo:
                                item.conversationNo ??
                                `CONV-${10000+index}`,


                            title:
                                item.title ?? "",


                            profilename:
                                item.profilename ??
                                item.customer?.name ??
                                "Unknown Customer",

                                
                            customerName:
                                item.profilename ??
                                item.customer?.name ??
                                "Unknown Customer",

                            customerImage:
                                item.customerImage ??
                                "/images/avatar/avatar-1.png",


                            mobile:
                                item.mobile ?? "",


                            tags:
                                item.tags ?? [],



                            assignedTo:{
                                name:
                                    item.assignedTo?.name ??
                                    "",

                                image:
                                    item.assignedTo?.image ??
                                    "/images/avatar/avatar-2.png"
                            },


                            department:
                                item.department ?? "",



                            status:
                                item.status ??
                                "open",


                            createdDate:
                                item.createdDate ?? "",



                            lastMessage:
                                item.lastMessage ?? "",



                            lastActivity:
                                item.lastActivity ?? "",



                            unread:
                                item.unread ?? 0,



                            isChatbot:
                                item.isChatbot ?? false,



                            action:null

                        })
                    )



                setConversationData(
                    formattedData
                )


            }
            catch(error){

                console.error(
                    "Failed loading conversations",
                    error
                )

            }
            finally{

                setLoading(false)

            }


        }



        loadConversation()



    },[])







    const customerOptions =
        React.useMemo(()=>{


            const customers =
                Array.from(
                    new Set(
                        conversationData.map(
                            item=>item.customerName
                        )
                    )
                )


            return customers.map(
                item=>({
                    value:item,
                    label:item
                })
            )


        },[conversationData])







    const summaryCounts =
        React.useMemo(()=>{


            const count={
                all:conversationData.length,
                open:0,
                pending:0,
                resolved:0,
                closed:0
            }



            conversationData.forEach(item=>{


                if(item.status==="open")
                    count.open++


                if(item.status==="pending")
                    count.pending++


                if(item.status==="in-progress")
                    count.resolved++


                if(item.status==="closed")
                    count.closed++


            })


            return count


        },[conversationData])








    const table =
        useReactTable({


            data:conversationData,


            columns,


            onSortingChange:setSorting,


            onColumnFiltersChange:setColumnFilters,


            getCoreRowModel:
                getCoreRowModel(),


            getPaginationRowModel:
                getPaginationRowModel(),


            getSortedRowModel:
                getSortedRowModel(),


            getFilteredRowModel:
                getFilteredRowModel(),



            onColumnVisibilityChange:
                setColumnVisibility,



            onRowSelectionChange:
                setRowSelection,



            state:{

                sorting,

                columnFilters,

                columnVisibility,

                rowSelection

            },


            filterFns:{
                status:statusFilterFn
            }



        })








    if(loading){

        return (

            <div className="p-5 text-center">

                Loading conversations...

            </div>

        )

    }







    return (

        <div className="w-full">


            <Table>

                <TableHeader>

                    {
                    table.getHeaderGroups()
                    .map(headerGroup=>(

                        <TableRow key={headerGroup.id}>


                        {
                        headerGroup.headers.map(header=>(


                            <TableHead key={header.id}>


                            {
                            flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )
                            }


                            </TableHead>


                        ))
                        }


                        </TableRow>

                    ))
                    }

                </TableHeader>




                <TableBody>


                {
                table.getRowModel().rows.length ?

                table.getRowModel()
                .rows
                .map(row=>(


                    <TableRow key={row.id}>


                    {
                    row.getVisibleCells()
                    .map(cell=>(


                        <TableCell key={cell.id}>


                        {
                        flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )
                        }


                        </TableCell>


                    ))
                    }


                    </TableRow>


                ))

                :

                <TableRow>

                    <TableCell
                    colSpan={columns.length}
                    className="text-center h-24"
                    >

                    No data found

                    </TableCell>

                </TableRow>

                }


                </TableBody>



            </Table>



            <TablePagination table={table}/>



        </div>

    )



}



export default ConversationTable