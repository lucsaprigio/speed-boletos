import { BoletoTable } from "@/components/boleto-table";
import { Duplicatas } from "@/dto/Duplicatas";

export const maxDuration = 30;

async function fetchBoletos(cdCliente: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API}/boletos/${cdCliente}`);

        if (!response.ok) {
            throw new Error(`Error fetching boletos: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function SpdBoleto({ params }) {

    const boletos: Duplicatas[] = await fetchBoletos(params.id);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="flex items-center justify-center">
                <BoletoTable data={boletos} />
            </div>
        </main>
    )
}