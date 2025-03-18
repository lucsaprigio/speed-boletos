"use server"

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from '@/env';

type PaymentType =
    {
        notification_url: string;
        description: string;
        email: string
        typeIdentification: string;
        numberIdentification: number;
        transaction_amount: number;
        reference: string;
    }

export const getPayment = async (id: string | number) => {
    try {

        const client = new MercadoPagoConfig(
            {
                accessToken: process.env.MP_ACCESS_TOKEN!,
                options: {
                    timeout: 5000,
                }
            }
        );

        const payment = new Payment(client);

        const response = await payment.get({ id })

        if (!response.id) {
            return null
        }

        return response
    } catch (error) {
        console.log(error)
        return null
    }

}

export const getStatusPayment = async (id: number | string) => {
    try {
        const client = new MercadoPagoConfig(
            {
                accessToken: process.env.MP_ACCESS_TOKEN!,
                options: {
                    timeout: 5000,
                }
            }
        );

        const payment = new Payment(client);

        const response = await payment.get({ id })

        if (!response.id) {
            return null
        }

        return {
            id: response.id,
            status: response.status,
        }
    } catch (error) {
        console.log(error)
        return null
    }

}