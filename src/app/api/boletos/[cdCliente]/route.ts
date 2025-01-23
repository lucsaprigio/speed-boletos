import { NextRequest, NextResponse } from "next/server";
import { executeTransaction } from "../../database/firebird";

import { format } from 'date-fns';

export async function GET(req: NextRequest, { params }: { params: { cdCliente: string } }) {
    try {
        const { cdCliente } = params;

        if (!cdCliente) {
            return NextResponse.json({ error: 'cdCliente is undefined' });
        }

        const date = new Date();
        const dateFormatted = format(date, 'dd.MM.yyyy');
        console.log(`SELECT * FROM SP_RETORNO_SITE_SPEED('${cdCliente}', '${dateFormatted}')`);

        const boletos = await executeTransaction(`SELECT * FROM SP_RETORNO_SITE_SPEED('${cdCliente}', '${dateFormatted}')`, []);

        if (!boletos[0]) {
            return NextResponse.json({ error: 'Usuário não encontrado' });
        }

        return NextResponse.json(boletos);
    } catch (err) {
        return NextResponse.json({ error: err.message });
    }
}