import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const maxDuration = 30;

async function fetchBoletos(cdCliente: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/boletos/${cdCliente}`);

        if (!response.ok) {
            throw new Error(`Error fetching boletos: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function SpdBoleto() {

    const boletos = await fetchBoletos("1");
    console.log(boletos);

    return (
        <main className="min-h-screen mx-auto flex justify-center">
            <div>
                <Table>
                    <TableCaption>Lista de Boletos</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                    </TableBody>
                </Table>

            </div>
        </main>
    )
}