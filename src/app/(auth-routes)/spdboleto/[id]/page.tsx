import BolatosDataTable from "@/app/(components)/datatable/_components/duplicatas-datatable";
import { Cliente } from "@/dto/Clientes";
import { Duplicatas } from "@/dto/Duplicatas";

export const maxDuration = 30;

async function fetchBoletos(cdCliente: string) {
    try {
        const response = await fetch(`${process.env.NEXT_API_LOCAL}/boletos/${cdCliente}`);

        if (response.status === 429) {
            throw new Error(`Número de requisição excedida, por favor tente daqui 2 minutos!`)
        }

        if (!response.ok) {
            throw new Error(`Error fetching boletos: ${response.statusText} - ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw new Error(error)
    }
}

export type BoletosResponse = {
    boletos: Duplicatas[],
    cliente: Cliente[]
}

export default async function SpdBoleto(props) {
    const params = await props.params;

    const response: BoletosResponse = await fetchBoletos(params.id);
    console.log(response.boletos);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="flex items-center justify-center">
                {
                    response && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-1xl font-bold my-3">{response.cliente[0].CGC_CLIENTE} -  {response.cliente[0].RAZAO_SOCIAL_CLIENTE} </h2>
                            <BolatosDataTable boletos={response.boletos} />
                        </div>
                    )
                }
            </div>
        </main>
    )
}