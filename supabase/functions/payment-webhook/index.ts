// supabase/functions/payment-webhook/index.ts
// Handle Razorpay webhook events

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { corsHeaders, jsonResponse, errorResponse } from "../_shared/cors.ts";

// Verify Razorpay webhook signature
async function verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const keyData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return expectedSignature === signature;
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only POST allowed
    if (req.method !== "POST") {
        return errorResponse("Method not allowed", 405);
    }

    try {
        const supabase = createServiceClient();

        // Get raw body for signature verification
        const rawBody = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            console.warn("Webhook without signature");
            return errorResponse("Missing signature", 400);
        }

        // Verify signature
        const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
        const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret);

        if (!isValid) {
            console.warn("Invalid webhook signature");
            return errorResponse("Invalid signature", 401);
        }

        // Parse webhook payload
        const payload = JSON.parse(rawBody);
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;

        console.log(`Webhook received: ${event}`);

        if (!paymentEntity) {
            return jsonResponse({ message: "No payment entity in webhook" });
        }

        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;
        const notes = paymentEntity.notes || {};

        if (!razorpayOrderId) {
            return jsonResponse({ message: "No order ID in webhook" });
        }

        // Find payment by Razorpay order ID
        let { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("razorpay_order_id", razorpayOrderId)
            .single();

        // Fallback: Find by payment ID from notes
        if (paymentError && notes.payment_id) {
            const result = await supabase
                .from("payments")
                .select("*")
                .eq("id", notes.payment_id)
                .single();
            payment = result.data;
            paymentError = result.error;
        }

        if (paymentError || !payment) {
            console.error(`Payment not found for order: ${razorpayOrderId}`);
            return jsonResponse({ message: "Payment not found" });
        }

        // Handle different events
        if (event === "payment.captured" || event === "order.paid") {
            // Payment successful
            const { data: updatedPayment, error: updateError } = await supabase
                .from("payments")
                .update({
                    status: "SUCCESS",
                    razorpay_payment_id: razorpayPaymentId,
                    gateway_response: paymentEntity,
                })
                .eq("id", payment.id)
                .eq("status", "PENDING") // Only if still pending
                .select()
                .single();

            if (updatedPayment) {
                console.log(`Payment ${payment.id} marked SUCCESS via webhook`);

                // Confirm enrollment
                if (payment.purpose === "COMPETITION_ENROLLMENT") {
                    const { error: enrollError } = await supabase
                        .from("enrollments")
                        .update({
                            status: "confirmed",
                            is_payment_confirmed: true,
                        })
                        .eq("payment_id", payment.id);

                    if (enrollError) {
                        console.error("Enrollment confirmation error:", enrollError);
                    } else {
                        console.log(`Enrollment confirmed for payment ${payment.id}`);
                    }
                }
            } else if (!updateError) {
                // Check if already success (idempotency)
                const { data: currentPayment } = await supabase
                    .from("payments")
                    .select("status")
                    .eq("id", payment.id)
                    .single();

                if (currentPayment?.status === "SUCCESS") {
                    console.log(`Payment ${payment.id} already SUCCESS, ignoring`);
                }
            }
        } else if (event === "payment.failed") {
            // Payment failed
            await supabase
                .from("payments")
                .update({
                    status: "FAILED",
                    failure_reason: paymentEntity.error_description || "Payment failed",
                    gateway_response: paymentEntity,
                })
                .eq("id", payment.id)
                .eq("status", "PENDING");

            console.log(`Payment ${payment.id} marked FAILED via webhook`);
        }

        return jsonResponse({ message: "Webhook processed" });
    } catch (error) {
        console.error("payment-webhook error:", error);
        return errorResponse("Internal server error", 500);
    }
});
