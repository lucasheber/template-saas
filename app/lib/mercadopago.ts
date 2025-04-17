import { MercadoPagoConfig } from 'mercadopago';

export const mercadoPagoConfig = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});