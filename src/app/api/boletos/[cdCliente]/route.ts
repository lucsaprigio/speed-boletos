import { NextRequest, NextResponse } from "next/server";
import { executeTransaction } from "../../../../database/firebird";

import { format } from 'date-fns';
import { rateLimiter } from "@/middlewares/rate-limiter";

export async function GET(req: NextRequest, props: { params: Promise<{ cdCliente: string }> }) {
    const rateLimitResponse = rateLimiter(req, 5);
    if (rateLimitResponse) {
        return rateLimitResponse
    }

    try {
        const params = await props.params;

        const { cdCliente } = params;

        if (!cdCliente) {
            return NextResponse.json({ error: 'cdCliente is undefined' });
        }

        const date = new Date();
        const dateFormatted = format(date, 'dd.MM.yyyy');

        function getBoletos() {
            let boletosQuery = `          
            SELECT 
              SP_RETORNO_SITE_SPEED.sp_documento,
              SP_RETORNO_SITE_SPEED.sp_parcela,
              SP_RETORNO_SITE_SPEED.sp_vencimento,
              SP_RETORNO_SITE_SPEED.sp_emissao,
              SP_RETORNO_SITE_SPEED.sp_valor,
              SP_RETORNO_SITE_SPEED.sp_atrz,
              SP_RETORNO_SITE_SPEED.sp_dias
            FROM SP_RETORNO_SITE_SPEED('${cdCliente}', '${dateFormatted}')
        `
            return executeTransaction(boletosQuery, []);
        };

        function getCliente() {
            let clientesQuery = `
                SELECT CGC_CLIENTE, RAZAO_SOCIAL_CLIENTE
                FROM DB_CLIENTE_CADASTRO WHERE CD_CLIENTE = ${cdCliente}
            `

            return executeTransaction(clientesQuery, []);
        }

        const [boletos, cliente] = await Promise.all([
            getBoletos(),
            getCliente()
        ]);

        if (!boletos[0]) {
            return NextResponse.json({ error: 'Usuário não encontrado' });
        };

        return NextResponse.json({ boletos, cliente });
    } catch (err) {
        return NextResponse.json({ error: err.message });
    }
}