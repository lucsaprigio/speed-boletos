// src/services/boletoService.ts
import { executeTransaction } from "@/database/firebird"; // Ajuste o caminho se necessário
import { format } from 'date-fns';
import { formatInTimeZone } from "date-fns-tz";
import { Duplicatas } from "@/dto/Duplicatas";

export class ServiceError extends Error {
    statusCode: number;
    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export async function getBoletosService(cdCliente: string) {
    if (!cdCliente) {
        throw new ServiceError('Código do cliente inválido', 400);
    }

    const date = new Date();
    const dateFormatted = format(date, 'dd.MM.yyyy');

    // Funções de Query (agora internas do service)
    const getBoletosQuery = () => {
        let boletosQuery = `          
            SELECT 
              SP_RETORNO_SITE_SPEED.sp_documento,
              SP_RETORNO_SITE_SPEED.sp_parcela,
              SP_RETORNO_SITE_SPEED.sp_vencimento,
              SP_RETORNO_SITE_SPEED.sp_emissao,
              SP_RETORNO_SITE_SPEED.sp_valor,
              SP_RETORNO_SITE_SPEED.sp_atrz,
              SP_RETORNO_SITE_SPEED.sp_dias,
              SP_RETORNO_SITE_SPEED.sp_pix
            FROM SP_RETORNO_SITE_SPEED('${cdCliente}', '${dateFormatted}')
        `
        return executeTransaction(boletosQuery, []);
    };

    const getClienteQuery = () => {
        let clientesQuery = `
                SELECT CGC_CLIENTE, RAZAO_SOCIAL_CLIENTE
                FROM DB_CLIENTE_CADASTRO WHERE CD_CLIENTE = ${cdCliente}
            `
        return executeTransaction(clientesQuery, []);
    }

    const [boletos, cliente] = await Promise.all([
        getBoletosQuery(),
        getClienteQuery()
    ]);

    if (!cliente || cliente.length === 0) {
        throw new ServiceError('Cliente não encontrado', 404);
    }

    if (!boletos || boletos.length === 0) {
        throw new ServiceError('Não existem boletos para este usuário', 404);
    }

    const formattedBoletos = boletos.map((boleto: Duplicatas) => {
        const vencimentoDate = new Date(boleto.SP_VENCIMENTO);
        const emissaoDate = new Date(boleto.SP_EMISSAO);

        const formattedVencimento = isNaN(vencimentoDate.getTime())
            ? 'Invalid Date'
            : formatInTimeZone(vencimentoDate, "America/Sao_Paulo", "dd/MM/yyyy");

        const formattedEmissao = isNaN(emissaoDate.getTime())
            ? 'Invalid Date'
            : formatInTimeZone(emissaoDate, "America/Sao_Paulo", "dd/MM/yyyy");

        return {
            ...boleto,
            TIMEZONE_SP_VENCIMENTO: formattedVencimento,
            TIMEZONE_SP_EMISSAO: formattedEmissao
        };
    });

    return { boletos: formattedBoletos, cliente };
}