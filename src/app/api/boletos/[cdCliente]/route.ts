import { NextRequest, NextResponse } from "next/server";
import { executeTransaction } from "../../../../database/firebird";

import { format } from 'date-fns';

export async function GET(req: NextRequest, { params }: { params: { cdCliente: string } }) {
    try {
        if (!params.cdCliente) {
            return NextResponse.json({ error: 'cdCliente is undefined' });
        }

        const date = new Date();
        const dateFormatted = format(date, 'dd.MM.yyyy');

        const boletos = await executeTransaction(`
            SELECT 
              SP_RETORNO_SITE_SPEED.sp_documento,
              SP_RETORNO_SITE_SPEED.sp_parcela,
              SP_RETORNO_SITE_SPEED.sp_vencimento,
              SP_RETORNO_SITE_SPEED.sp_emissao,
              SP_RETORNO_SITE_SPEED.sp_valor,
              SP_RETORNO_SITE_SPEED.sp_atrz,
              SP_RETORNO_SITE_SPEED.sp_dias
            FROM SP_RETORNO_SITE_SPEED('${params.cdCliente}', '${dateFormatted}')
        `, []);

        if (!boletos[0]) {
            return NextResponse.json({ error: 'Usuário não encontrado' });
        }

        return NextResponse.json(boletos);
    } catch (err) {
        return NextResponse.json({ error: err.message });
    }
}