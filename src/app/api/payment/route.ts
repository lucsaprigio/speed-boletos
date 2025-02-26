import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { PaymentRequest } from '@/types/Payment';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
    options: { timeout: 5000 }
});

export async function POST(req: Request) {
    const body = await req.json();

    const payment = new Payment(client);

    const {
        transaction_amount,
        description,
        email,
        first_name
    } = body

    if (!transaction_amount) {
        return NextResponse.json("Value is requires", { status: 400 })
    }

    const generateIdPotencyKey = randomUUID();

    const paymentData: PaymentRequest = {
        body: {
            notification_url: `${process.env.MP_NOTIFICATION_URL}`,
            description,
            payment_method_id: "pix",
            transaction_amount,
            additional_info: {
                payer: {
                    first_name
                }
            },
            payer: {
                email
            }
        },
        requestOptions: {
            idempotencyKey: generateIdPotencyKey
        }
    }

    const response = await payment.create(paymentData);
    const result = {
        qr_code_64: response.point_of_interaction?.transaction_data?.qr_code_base64,
        qr_code: response.point_of_interaction?.transaction_data?.qr_code,
        ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
        account_holder_name: response.point_of_interaction?.transaction_data?.bank_info?.collector?.account_id,
    }

    return Response.json({ url: result });

}