// supabase/functions/enroll-competition/index.ts
// Create enrollment and initiate payment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createServiceClient, requireAuth } from "../_shared/supabase.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

interface EnrollRequest {
    competition_id: string;
}

interface EnrollResponse {
    payment_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    competition_title: string;
    razorpay_key_id: string;
}

serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const user = await requireAuth(req);
        const supabase = createServiceClient();

        const body: EnrollRequest = await req.json();
        const { competition_id } = body;

        if (!competition_id) {
            return errorResponse("competition_id is required", 400);
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return errorResponse("User profile not found", 404);
        }

        // Check profile completion
        if (!profile.is_profile_complete) {
            return errorResponse("Please complete your profile before enrolling", 403);
        }

        // Get competition
        const { data: competition, error: compError } = await supabase
            .from("competitions")
            .select("*")
            .eq("id", competition_id)
            .eq("is_published", true)
            .single();

        if (compError || !competition) {
            return errorResponse("Competition not found", 404);
        }

        // Check grade eligibility
        const userGrade = profile.student_grade || 0;
        if (userGrade < competition.min_grade || userGrade > competition.max_grade) {
            return errorResponse(
                `This competition is for grades ${competition.min_grade}-${competition.max_grade}. Your grade is ${userGrade}.`,
                400
            );
        }

        // Check registration period
        const now = new Date();
        const regStart = new Date(competition.registration_start_date);
        const regEnd = new Date(competition.registration_end_date);

        if (now < regStart || now > regEnd) {
            return errorResponse("Registration is not open for this competition", 400);
        }

        // Check for existing confirmed enrollment
        const { data: existingEnrollment } = await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .eq("competition_id", competition_id)
            .single();

        if (existingEnrollment?.status === "confirmed") {
            return errorResponse("You are already enrolled in this competition", 409);
        }

        // Calculate amount (in paise)
        const amountInPaise = Math.round(competition.enrollment_fee * 100);
        const currency = "INR";

        // Create Razorpay order
        const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID")!;
        const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

        const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

        const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${razorpayAuth}`,
            },
            body: JSON.stringify({
                amount: amountInPaise,
                currency,
                receipt: `enroll_${user.id}_${competition_id}`.substring(0, 40),
                notes: {
                    user_id: user.id,
                    competition_id,
                    purpose: "COMPETITION_ENROLLMENT",
                },
            }),
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error("Razorpay order error:", errorText);
            return errorResponse("Failed to create payment order", 500);
        }

        const razorpayOrder = await orderResponse.json();

        // Create payment record
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                amount: amountInPaise,
                currency,
                status: "PENDING",
                gateway: "RAZORPAY",
                razorpay_order_id: razorpayOrder.id,
                purpose: "COMPETITION_ENROLLMENT",
                reference_id: competition_id,
                base_amount: amountInPaise,
                gst_amount: 0,
                user_snapshot: {
                    name: profile.student_name,
                    email: profile.email,
                    phone: profile.phone,
                },
            })
            .select()
            .single();

        if (paymentError || !payment) {
            console.error("Payment creation error:", paymentError);
            return errorResponse("Failed to create payment record", 500);
        }

        // Create or update enrollment record
        if (existingEnrollment) {
            // Update existing pending enrollment
            await supabase
                .from("enrollments")
                .update({
                    payment_id: payment.id,
                    status: "pending",
                    is_payment_confirmed: false,
                    competition_snapshot: {
                        title: competition.title,
                        exam_date: competition.exam_date,
                        enrollment_fee: competition.enrollment_fee,
                    },
                    user_snapshot: {
                        name: profile.student_name,
                        email: profile.email,
                        grade: profile.student_grade,
                    },
                    attribution_code: profile.referred_by_code,
                })
                .eq("id", existingEnrollment.id);
        } else {
            // Create new enrollment
            await supabase.from("enrollments").insert({
                user_id: user.id,
                competition_id,
                payment_id: payment.id,
                is_payment_confirmed: false,
                status: "pending",
                competition_snapshot: {
                    title: competition.title,
                    exam_date: competition.exam_date,
                    enrollment_fee: competition.enrollment_fee,
                },
                user_snapshot: {
                    name: profile.student_name,
                    email: profile.email,
                    grade: profile.student_grade,
                },
                attribution_code: profile.referred_by_code,
            });
        }

        const response: EnrollResponse = {
            payment_id: payment.id,
            razorpay_order_id: razorpayOrder.id,
            amount: amountInPaise,
            currency,
            competition_title: competition.title,
            razorpay_key_id: razorpayKeyId,
        };

        return jsonResponse({ success: true, data: response });
    } catch (error) {
        console.error("enroll-competition error:", error);
        if (error instanceof Error && error.message === "Unauthorized") {
            return errorResponse("Unauthorized", 401);
        }
        return errorResponse("Internal server error", 500);
    }
});
