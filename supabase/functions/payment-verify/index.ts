// supabase/functions/payment-verify/index.ts
// Verify payment after Razorpay checkout

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, requireAuth } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

interface VerifyPaymentRequest {
    payment_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    enrollment_confirmed: boolean;
}

// HMAC-SHA256 signature verification
async function verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${orderId}|${paymentId}`);
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
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const user = await requireAuth(req);
        const supabase = createServiceClient();

        const body: VerifyPaymentRequest = await req.json();
        const { payment_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!payment_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return errorResponse("All payment fields are required", 400);
        }

        // Get payment record
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("id", payment_id)
            .eq("user_id", user.id)
            .single();

        if (paymentError || !payment) {
            return errorResponse("Payment not found", 404);
        }

        // Check if already verified
        if (payment.status === "SUCCESS") {
            return jsonResponse({
                success: true,
                data: {
                    success: true,
                    message: "Payment already verified",
                    enrollment_confirmed: true,
                } as VerifyPaymentResponse,
            });
        }

        // Verify signature
        const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
        const isValid = await verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            razorpayKeySecret
        );

        if (!isValid) {
            // Mark payment as failed
            await supabase
                .from("payments")
                .update({
                    status: "FAILED",
                    failure_reason: "Invalid signature",
                    gateway_response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
                })
                .eq("id", payment_id);

            return errorResponse("Payment verification failed", 400);
        }

        // Update payment to SUCCESS (atomic update - only if PENDING)
        const { data: updatedPayment, error: updateError } = await supabase
            .from("payments")
            .update({
                status: "SUCCESS",
                razorpay_payment_id,
                razorpay_signature,
                gateway_response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
            })
            .eq("id", payment_id)
            .eq("status", "PENDING") // Only update if still pending
            .select()
            .single();

        if (updateError || !updatedPayment) {
            // Check if already success (race condition with webhook)
            const { data: currentPayment } = await supabase
                .from("payments")
                .select("status")
                .eq("id", payment_id)
                .single();

            if (currentPayment?.status === "SUCCESS") {
                return jsonResponse({
                    success: true,
                    data: {
                        success: true,
                        message: "Payment already verified",
                        enrollment_confirmed: true,
                    } as VerifyPaymentResponse,
                });
            }

            return errorResponse("Payment verification failed", 400);
        }

        // Confirm enrollment
        const { error: enrollError } = await supabase
            .from("enrollments")
            .update({
                status: "confirmed",
                is_payment_confirmed: true,
            })
            .eq("payment_id", payment_id);

        if (enrollError) {
            console.error("Enrollment confirmation error:", enrollError);
        }

        const response: VerifyPaymentResponse = {
            success: true,
            message: "Payment verified successfully",
            enrollment_confirmed: true,
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("payment-verify error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
