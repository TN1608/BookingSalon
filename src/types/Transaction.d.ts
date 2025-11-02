export interface StripeCheckoutSessionResponse {
    message: string;
    session: StripeCheckoutSession;
}

export interface StripeCheckoutSession {
    id: string;
    object: string;
    adaptive_pricing: {
        enabled: boolean;
    };
    after_expiration: never;
    allow_promotion_codes: never;
    amount_subtotal: number;
    amount_total: number;
    automatic_tax: {
        enabled: boolean;
        liability: never;
        provider: never;
        status: never;
    };
    billing_address_collection: never;
    cancel_url: string;
    client_reference_id: never;
    client_secret: never;
    collected_information: never;
    consent: never;
    consent_collection: never;
    created: number;
    currency: string;
    currency_conversion: never;
    custom_fields: never[];
    custom_text: {
        after_submit: never;
        shipping_address: never;
        submit: never;
        terms_of_service_acceptance: never;
    };
    customer: never;
    customer_creation: string;
    customer_details: {
        address: {
            city: never;
            country: string;
            line1: never;
            line2: never;
            postal_code: string;
            state: never;
        };
        email: string;
        name: string;
        phone: never;
        tax_exempt: string;
        tax_ids: never[];
    };
    customer_email: never;
    discounts: never[];
    expires_at: number;
    invoice: never;
    invoice_creation: {
        enabled: boolean;
        invoice_data: {
            account_tax_ids: never;
            custom_fields: never;
            description: never;
            footer: never;
            issuer: never;
            metadata: Record<string, never>;
            rendering_options: never;
        };
    };
    livemode: boolean;
    locale: never;
    metadata: Record<string, never>;
    mode: string;
    origin_context: never;
    payment_intent: string;
    payment_link: never;
    payment_method_collection: string;
    payment_method_configuration_details: never;
    payment_method_options: {
        card: {
            request_three_d_secure: string;
        };
    };
    payment_method_types: string[];
    payment_status: string;
    permissions: never;
    phone_number_collection: {
        enabled: boolean;
    };
    recovered_from: never;
    saved_payment_method_options: never;
    setup_intent: never;
    shipping_address_collection: never;
    shipping_cost: never;
    shipping_options: never[];
    status: string;
    submit_type: never;
    subscription: never;
    success_url: string;
    total_details: {
        amount_discount: number;
        amount_shipping: number;
        amount_tax: number;
    };
    ui_mode: string;
    url: never;
    wallet_options: never;
}