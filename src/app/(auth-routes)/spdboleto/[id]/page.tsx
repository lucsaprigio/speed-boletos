import BolatosDataTable from "@/app/(components)/datatable/_components/duplicatas-datatable";
import { Cliente } from "@/dto/Clientes";
import { Duplicatas } from "@/dto/Duplicatas";
import { AppError } from "@/AppError/AppError";

export const maxDuration = 30;

async function fetchBoletos(cdCliente: string) {
    try {
        const response = await fetch(`${process.env.NEXT_API_LOCAL}/boletos/${cdCliente}`);

        if (response.status === 429) {
            throw new AppError(`Número de requisição excedida, por favor tente daqui 2 minutos!`, 429)
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
        response = await fetchBoletos(params.id)
    } catch (err) {
        if (err instanceof AppError) {
            error = err.message;
            statusCode = err.statusCode
        }
    }

    if (error) {
        return (
            <main className="min-h-screen flex justify-center mt-24">
                <div className="flex flex-col text-red-600 gap-10">
                    <h1 className="font-bold text-7xl font-mono">Error {statusCode}</h1>
                    <p className="text-2xl">{error}</p>
                </div>
            </main>
        )
    }

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