import BolatosDataTable from "@/app/(components)/datatable/_components/duplicatas-datatable";
import { Cliente } from "@/dto/Clientes";
import { Duplicatas } from "@/dto/Duplicatas";
import { AppError } from "@/AppError/AppError";
import { QRCodeWhatsapp } from "@/app/(components)/qrcode-whatsapp";
import { getBoletosService, ServiceError } from "@/services/boleto-service";

export type BoletosResponse = {
    boletos: Duplicatas[],
    cliente: Cliente[]
}

export default async function SpdBoleto(props: any) {
    const params = await props.params;

    let response: BoletosResponse = { boletos: [], cliente: [] };
    let error: string = '';
    let statusCode: number = 0;

    try {
        response = await getBoletosService(params.cdCliente);
    } catch (err) {
        console.error("Erro ao carregar dados:" , err);
        if (err instanceof ServiceError) {
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
                            <BolatosDataTable boletos={response.boletos} cliente={response.cliente[0].RAZAO_SOCIAL_CLIENTE} cnpj={response.cliente[0].CGC_CLIENTE} />
                        </div>
                    )
                }
            </div>
            <div className="absolute bottom-3 right-3">
                <QRCodeWhatsapp />
            </div>
        </main>
    )
}
