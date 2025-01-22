import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function SpdBoleto() {
    return (
        <main className="min-h-screen mx-auto flex justify-center">
            <div>
                <h2 className="text-2xl text-black mt-10 font-bold">Boletos Speed</h2>
                <Table>
                    <TableCaption>Boletos Speed</TableCaption>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Nome</TableHeader>
                            <TableHeader>Valor</TableHeader>
                            <TableHeader>Vencimento</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>João</TableCell>
                            <TableCell>100,00</TableCell>
                            <TableCell>10/10/2021</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maria</TableCell>
                            <TableCell>200,00</TableCell>
                            <TableCell>10/10/2021</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}