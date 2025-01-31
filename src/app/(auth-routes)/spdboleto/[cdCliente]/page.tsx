import BolatosDataTable from "@/app/(components)/datatable/_components/duplicatas-datatable";
import { Cliente } from "@/dto/Clientes";
import { Duplicatas } from "@/dto/Duplicatas";
import { AppError } from "@/AppError/AppError";

export const maxDuration = 30;

async function fetchBoletos(cdCliente: string) {
    try {

        if (!cdCliente) {
            throw new AppError('Código do cliente ou CNPJ do cliente inválido', 400);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_LOCAL}/boletos/${cdCliente}`);

        if (response.status === 429) {
            throw new AppError(`Número de requisição excedida, por favor tente daqui 2 minutos!`, 429)
        }

        if (response.status === 404) {
            throw new AppError(`Cliente não encontrado.`, 404)
        }

        if (!response.ok) {
            throw new AppError(`Error fetching boletos: ${response.statusText} - ${response.status}`, 404);
        }

        return response.json();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError(error.message, 500);
        }
    }
}

export type BoletosResponse = {
    boletos: Duplicatas[],
    cliente: Cliente[]
}

export default async function SpdBoleto(props) {
    const params = await props.params;

    let response: BoletosResponse;
    let error: string;
    let statusCode: number;

    try {
        response = await fetchBoletos(params.cdCliente);
        console.log(response.boletos)
    } catch (err) {
        if (err instanceof AppError) {
            error = err.message;
            statusCode = err.statusCode
        }
    }

    if (error) {
        return (
            <main className="min-h-screen flex justify-center bg-zinc-800">
                <div className="flex flex-col items-center text-gray-100 gap-10 p-10">
                    <h2 className="font-bold text-7xl font-mono mt-10">Error</h2>
                    <h2 className="font-bold text-4xl">{statusCode}</h2>
                    <p className="text-2xl">{error}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="max-sm:w-6/12 flex items-center justify-center">
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