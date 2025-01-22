import { NextRequest, NextResponse } from "next/server";
import { executeTransaction } from "../../../database/firebird";

import { format } from 'date-fns';

export async function GET(req: NextRequest, { params }: { params: { cdCliente: string } }) {
    try {
        const date = new Date();

        const dateFormatted = format(date, 'dd.MM.yyyy');

        const boletos = await executeTransaction(`SELECT * FROM SP_RETORNO_SITE_SPEED(${params.cdCliente}, ${dateFormatted})`, []);

        if (!boletos[0]) {
            return NextResponse.json('Usuário não encontrado');
        }

        return NextResponse.json(boletos);
    } catch (err) {
        return NextResponse.json(err);
    }
} 