import { MercadoPagoConfig } from 'mercadopago';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const mercadoPagoConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export function validateWebhookRequest(req: NextRequest) {
    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');

    // Obtain Query params related to the request URL
    const urlParams = new URL(req.url);
    const dataID = urlParams.searchParams.get('data.id');

    if (!xSignature || !xRequestId) {
        throw new Error('Missing required headers');
    }

    const signatureParts = xSignature.split(',');
    let ts = '';
    let hash = '';

    signatureParts.forEach((part) => {
        // Split each part into key and value
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
                ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
                hash = trimmedValue;
            }
        }
    });
    if (!ts || !hash) {
        throw new Error('Invalid signature format');
    }

    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error('Missing secret key');
    }

    // Generate the manifest string
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

    // Create an HMAC signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);

    // Obtain the hash result as a hexadecimal string
    const sha = hmac.digest('hex');

    if (sha !== hash) {
        throw new Error('HMAC verification failed');
    }
}
