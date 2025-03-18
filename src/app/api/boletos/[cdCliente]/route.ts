import { NextRequest, NextResponse } from "next/server";
import { executeTransaction } from "../../../../database/firebird";

import { format } from 'date-fns';
import { rateLimiter } from "@/middlewares/rate-limiter";
import { formatInTimeZone } from "date-fns-tz";
import { Duplicatas } from "@/dto/Duplicatas";

export async function GET(req: NextRequest, props: { params: Promise<{ cdCliente: string }> }) {
    const rateLimitResponse = rateLimiter(req, 5);

    if (rateLimitResponse) {
        return rateLimitResponse
    }

    const params = await props.params;

    try {
        const { cdCliente } = params;

        if (!cdCliente) {
            return NextResponse.json({ error: 'Código do cliente inválido' }, { status: 404 });
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

        if (cliente.length === 0) {
            return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
        }

        if (boletos.length === 0) {
            return NextResponse.json({ error: 'Não existe boletos para este usuário' }, { status: 404 });
        };

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

        return NextResponse.json({ boletos: formattedBoletos, cliente });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err.message });
    }
}