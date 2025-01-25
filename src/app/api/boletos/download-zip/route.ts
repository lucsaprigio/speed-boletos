import { executeQueryBlob } from "@/database/firebird";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough } from "stream";
import { rateLimiter } from "@/middlewares/rate-limiter";

export const maxDuration = 20;

export async function POST(request: NextRequest): Promise<NextResponse> {
    const rateLimitResponse = rateLimiter(request, 15);
    if (rateLimitResponse) {
        return rateLimitResponse
    }

    try {
        const { duplicatas } = await request.json();
        console.log(duplicatas);

        if (!duplicatas || !Array.isArray(duplicatas) || duplicatas.length === 0) {
            return NextResponse.json({ error: 'Duplicatas não informadas!' });
        }

        const duplDownload = await executeQueryBlob(`
            SELECT ITEN, BOLETO FROM DB_DUPL_ARECEBER_BOLETO
            WHERE DB_DUPL_ARECEBER_BOLETO.iten in ( ${duplicatas} )
        `, []);

        if (!duplDownload.length) {
            return NextResponse.json({ error: "Boletos não encontrados!" }, { status: 404 });
        }

        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        const passthrough = new PassThrough();
        archive.pipe(passthrough);

        duplDownload.forEach((record) => {
            const blob = record.BOLETO;
            const numeroDuplicata = record.ITEN;
            if (blob) {
                const bufferBoleto = Buffer.from(blob, 'binary');
                archive.append(bufferBoleto, { name: `${numeroDuplicata}.pdf` });
            }
        });

        archive.finalize();

        const headers = new Headers({
            'Content-Disposition': `attachment; filename="boletos-speed.zip"`,
            'Content-Type': 'application/zip'
        });

        return new NextResponse(passthrough as any, { headers });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to retrieve and download PDFs' }, { status: 500 });
    }
}