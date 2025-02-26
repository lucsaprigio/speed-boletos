export type PaymentRequest = {
    body: {
        transaction_amount: number;
        description: string;
        payment_method_id: string;
        notification_url?: string;
        date_of_expiration?: string;
        additional_info: {
            payer: {
                first_name: string;
            }
        }
        payer: {
            email: string;
        }
    },
    requestOptions?: {
        idempotencyKey?: string;
    }
}