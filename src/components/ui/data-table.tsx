"use client"
import { useEffect, useState } from "react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Boletos } from "@/app/(components)/datatable/_interfaces/Boletos"
import { Button } from "./button"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "./toast"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends Boletos, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [selectedDuplicatas, setSelectedDuplicatas] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleDownloadZipDupl(duplicatas: number[]) {
        try {
            setLoading(true);
            document.body.style.cursor = 'progress';

            toast({
                title: 'Gerando ZIP',
                description: 'Aguarde um momento, o download será iniciado em breve',
                action: <ToastAction altText="Fechar">Fechar</ToastAction>,
                duration: 5000,
                variant: 'default'
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL}/boletos/download-zip`, {
                method: 'POST',
                body: JSON.stringify({
                    duplicatas
                })
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            setSelectedDuplicatas([]);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `boletos-speed.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast({
                title: 'Erro ao baixar o arquivo',
                description: 'Tente novamente mais tarde',
                duration: 5000,
                variant: 'destructive'
            })
            setLoading(false)
            throw new Error(error);
        } finally {
            document.body.style.cursor = 'default';
            setSelectedDuplicatas([]);
            setLoading(false)
        }
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection
        }
    });

    useEffect(() => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const duplicatas = selectedRows.map(row => row.original.SP_DOCUMENTO);
        setSelectedDuplicatas(duplicatas);
    }, [rowSelection, table]);

    return (
        <div className="max-sm:w-full rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead className="text-blue-950 font-bold " key={header.id}>
                                        {
                                            header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                        }
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={`hover:bg-gray-150 transition-all duration-100 ${row.original.SP_DIAS > 5 && "bg-red-200 hover:bg-red-300"}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Sem resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex-1 text-sm text-muted-foreground p-3">
                {table.getFilteredSelectedRowModel().rows.length} de {" "}
                {table.getFilteredRowModel().rows.length} linhas(s) selecionadas.
            </div>
            <div className="h-10 px-3">
                {
                    selectedDuplicatas.length > 0 &&
                    <Button
                        className={`${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                        variant="default"
                        disabled={loading}
                        onClick={() => handleDownloadZipDupl(selectedDuplicatas)}>Baixar duplicatas selecionadas
                    </Button>

                }
            </div>
        </div >
    )
}
