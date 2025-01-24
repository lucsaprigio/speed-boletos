'use client'

import { Duplicatas } from "@/dto/Duplicatas";

import { format } from 'date-fns';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ButtonPdf, ButtonPix } from "@/components/buttons-icon";
import { formatCurrency } from "@/utils/formatCurrency";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";


type BoletosTableProps = {
    data: Duplicatas[];
}

export function BoletoTable({ data }: BoletosTableProps) {
    const { toast } = useToast();

    async function handleDownloadDupl(dupl: number) {
        try {
            document.body.style.cursor = 'progress';

            toast({
                title: 'Baixando Arquivo XML',
                description: 'Aguarde um momento, o download será iniciado em breve',
                action: <ToastAction altText="Fechar">Fechar</ToastAction>,
                variant: 'default'
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API}/boletos/download/${dupl}`, {
                method: 'GET'
            });

            if (!response.ok) {
                console.log(response)
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
            console.log(error);
            toast({
                title: 'Erro ao baixar o arquivo',
                description: 'Arquivo não encontrado',
                variant: 'destructive'
            })
        } finally {
            document.body.style.cursor = 'default';
        }


    }

    return (
        <Table className="border-[1px] rounded-md border-black mt-20">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-blue-950 font-bold">Documento</TableHead>
                    <TableHead className="text-blue-950 font-bold">Parcela</TableHead>
                    <TableHead className="text-blue-950 font-bold">Vencimento</TableHead>
                    <TableHead className="text-blue-950 font-bold">Emissao</TableHead>
                    <TableHead className="text-blue-950 font-bold">Valor</TableHead>
                    <TableHead className="text-blue-950 font-bold">Dias</TableHead>
                    <TableHead className="text-blue-950 font-bold"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data && data.map((boleto) => (
                        <TableRow key={boleto.SP_DOCUMENTO}>
                            <TableCell>{boleto.SP_DOCUMENTO}</TableCell>
                            <TableCell className="text-center">{boleto.SP_PARCELA}</TableCell>
                            <TableCell>{format(boleto.SP_VENCIMENTO, 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{format(boleto.SP_EMISSAO, 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="text-right">{formatCurrency(boleto.SP_VALOR)}</TableCell>
                            <TableCell className="text-center">{boleto.SP_DIAS}</TableCell>
                            <TableCell className="space-x-2">
                                <ButtonPdf onClick={() => { handleDownloadDupl(boleto.SP_DOCUMENTO) }} />
                                <ButtonPix />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}