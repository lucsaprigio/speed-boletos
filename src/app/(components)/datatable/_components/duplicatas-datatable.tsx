'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Boletos } from "../_interfaces/Boletos"
import { DataTable } from "@/components/ui/data-table"
import { formatCurrency } from "@/utils/formatCurrency"
import { format } from "date-fns"
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Checkbox } from "@/components/ui/checkbox"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { FilePdf, PixLogo } from "@phosphor-icons/react"

async function handleDownloadDupl(dupl: number) {
    try {
        document.body.style.cursor = 'progress';

        toast({
            title: 'Baixando Arquivo PDF',
            description: 'Aguarde um momento, o download será iniciado em breve',
            action: <ToastAction altText="Fechar">Fechar</ToastAction>,
            duration: 5000,
            variant: 'default'
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL}/boletos/download/${dupl}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${dupl}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        toast({
            title: 'Erro ao baixar o arquivo',
            description: 'Arquivo não encontrado',
            duration: 5000,
            variant: 'destructive'
        });
    } finally {
        document.body.style.cursor = 'default';
    }
}

const DropdownActions = ({ dupl }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-blue-950 flex flex-col items-start justify-between" align="end">
                <DropdownMenuLabel className="text-gray-50 font-normal">Ações</DropdownMenuLabel>
                <DropdownMenuItem
                    className="flex w-full justify-between group"
                    onClick={() => handleDownloadDupl(dupl)}
                >
                    <strong className="text-gray-50 group-hover:text-red-800">PDF</strong>
                    <FilePdf className="text-gray-50 group-hover:text-red-800" size={24} />
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex w-full justify-between group"
                    onClick={() => { }}
                >
                    <strong className="text-gray-50 group-hover:text-cyan-400">Pix (Em breve)</strong>
                    <PixLogo className="text-gray-50 group-hover:text-cyan-400" size={24} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<Boletos>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="space-x-3"
                checked={
                    table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() || "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="space-x-3"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "SP_DOCUMENTO",
        header: "Documento",
        cell: ({ row }) => {
            return <div>{row.getValue("SP_DOCUMENTO")}</div>
        }
    },
    {
        accessorKey: "SP_PARCELA",
        header: "Parcela",
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("SP_PARCELA")}</div>
        }
    },
    {
        accessorKey: "SP_VENCIMENTO",
        header: "Vencimento",
        cell: ({ row }) => {
            const date = row.getValue("SP_VENCIMENTO") as Date;

            const formattedDate = formatInTimeZone(date, "America/Sao_Paulo", "dd/MM/yyyy")

            return <div className={`max-sm:hidden text-center ${row.getValue("SP_DIAS") as number > 5 && "text-red-700 font-bold "}`}>{formattedDate}</div>
        }
    },
    /*     {
            accessorKey: "SP_EMISSAO",
            header: "Emissão",
            cell: ({ row }) => {
                const date = row.getValue("SP_EMISSAO") as Date;
    
                const formattedDate = format(date, "dd/MM/yyyy")
    
                return <div>{formattedDate}</div>
            }
        }, 
    */
    {
        accessorKey: "SP_VALOR",
        header: "Valor",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("SP_VALOR"));

            const formattedAmount = formatCurrency(amount);

            return <div>{formattedAmount}</div>
        }
    },
    {
        accessorKey: "SP_DIAS",
        header: () => {
            return (
                <div className="max-sm:hidden text-center">Dias</div>
            )
        },
        cell: ({ row }) => {
            return <div className={`max-sm:hidden text-center ${row.getValue("SP_DIAS") as number > 5 && "text-red-700 font-bold"}`}>{row.getValue("SP_DIAS")}</div>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const dupl = row.original.SP_DOCUMENTO
            return (
                <DropdownActions dupl={dupl} />
            )
        },
    },
]

interface Props {
    boletos: Boletos[]
}

export default function BoletosDataTable({ boletos }: Props) {
    return <DataTable columns={columns} data={boletos} />
}
