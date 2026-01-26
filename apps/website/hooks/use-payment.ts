// hooks/use-payment.ts
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments.service";
import { enrollmentsService } from "@/services/enrollments.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loadScript } from "@/lib/utils/script-loader";

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Fetch Key ID
  const { data: razorpayKey } = useQuery({
    queryKey: ["razorpay-key"],
    queryFn: paymentsService.getRazorpayKey,
    staleTime: Infinity, // Key unlikely to change often
  });

  // Verify Mutation
  const verifyMutation = useMutation({
    mutationFn: paymentsService.verifyPayment,
    onSuccess: (data) => {
      toast.success("Payment successful! Enrollment confirmed.");
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error.message || "Payment verification failed. Please contact support.");
      setIsProcessing(false);
    },
  });

  // Initiate Enrollment & Payment Flow
  const initiatePayment = async (competitionId: string, userDetails: { name: string; email: string; contact: string }) => {
    if (!razorpayKey?.keyId) {
      toast.error("Payment system unavailable. Please try again later.");
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay Script
      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isLoaded) {
        toast.error("Failed to load payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 1. Create Enrollment & Order on Backend
      const orderData = await enrollmentsService.createEnrollment(competitionId);

      // 2. Open Razorpay Options
      const options = {
        key: razorpayKey.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wisdom Abacus Academy",
        description: `Enrollment for ${orderData.competitionTitle}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          // 3. Verify on Success
          verifyMutation.mutate({
            paymentId: orderData.paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: {
          color: "#F97316", // Orange-500 matches your brand
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast.error(error.message || "Failed to initiate payment.");
      setIsProcessing(false);
    }
  };

  return {
    initiatePayment,
    isProcessing,
    isVerifying: verifyMutation.isPending,
  };
};
