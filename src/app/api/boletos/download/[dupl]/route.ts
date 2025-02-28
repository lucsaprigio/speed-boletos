import { executeQueryBlob } from "@/database/firebird";
import { rateLimiter } from "@/middlewares/rate-limiter";
import { NextResponse, NextRequest } from "next/server";

export const maxDuration = 20;

export async function GET(req: NextRequest, props: { params: Promise<{ dupl: string }> }) {
    const params = await props.params;

    const rateLimitResponse = rateLimiter(req, 15);
    if (rateLimitResponse) {
        return rateLimitResponse
    }

    try {
        const { dupl } = params;

        if (!dupl) {
            return NextResponse.json({ error: 'Duplicata não informada!' });
        }

        const duplDownload = await executeQueryBlob(`
            SELECT BOLETO FROM DB_DUPL_ARECEBER_BOLETO
            WHERE DB_DUPL_ARECEBER_BOLETO.iten = ${dupl}
    `, []);

        if (!duplDownload.length || !duplDownload[0].BOLETO) {
            return NextResponse.json({ error: "Boleto não encontrado!" }, { status: 404 });
        }

        const blob = duplDownload[0].BOLETO;

        if (!blob) {
            return NextResponse.json({ error: 'PDF não encontrado' });
        }

        const bufferBoleto = Buffer.from(blob, 'binary');

        const fileName = `${dupl}.pdf`;

        const headers = new Headers({
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'application/pdf'
        });

        return new NextResponse(bufferBoleto, { headers });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to retrieve and download PDF' }, { status: 500 });
    }
}
