/* eslint-disable @typescript-eslint/no-explicit-any */
import { paymentsService } from "@/services/payments.service";

// Razorpay TypeScript types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: any) => void): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      console.log("✅ Razorpay already loaded");
      resolve(true);
      return;
    }

    console.log("📦 Loading Razorpay script...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay script loaded successfully");
      resolve(true);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Razorpay script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout
 */
export const openRazorpayCheckout = async (
  options: {
    amount: number;
    currency: string;
    orderId: string;
    competitionTitle: string;
    userEmail?: string;
    userName?: string;
    userPhone?: string;
  },
  onSuccess: (response: RazorpayResponse) => void | Promise<void>,
  onFailure: (error: Error) => void
): Promise<void> => {
  try {
    console.log("🔧 Opening Razorpay checkout with options:", options);

    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK");
    }

    // Get Razorpay key from backend
    console.log("🔑 Fetching Razorpay config...");
    const config = await paymentsService.getRazorpayKey();
    console.log("✅ Razorpay config received:", { keyId: config.keyId });

    // Create Razorpay options
    const razorpayOptions: RazorpayOptions = {
      key: config.keyId,
      amount: options.amount,
      currency: options.currency,
      name: "Wisdom Abacus Academy",
      description: options.competitionTitle,
      order_id: options.orderId,
      prefill: {
        name: options.userName,
        email: options.userEmail,
        contact: options.userPhone,
      },
      theme: {
        color: "#f97316", // Your primary color
      },
      modal: {
        ondismiss: () => {
          console.log("❌ User dismissed payment modal");
          onFailure(new Error("Payment cancelled by user"));
        },
      },
      handler: async (response) => {
        console.log("✅ Payment handler called with response:", response);
        try {
          await onSuccess(response);
        } catch (error) {
          console.error("❌ Error in success handler:", error);
          onFailure(
            error instanceof Error
              ? error
              : new Error("Payment verification failed")
          );
        }
      },
    };

    console.log("🚀 Creating Razorpay instance...");
    // Create and open Razorpay instance
    const razorpay = new window.Razorpay(razorpayOptions);

    // Handle payment failure
    razorpay.on("payment.failed", (response: any) => {
      console.error("❌ Razorpay payment.failed event:", response);
      onFailure(
        new Error(
          response.error?.description || "Payment failed. Please try again."
        )
      );
    });

    console.log("✅ Opening Razorpay modal...");
    razorpay.open();
  } catch (error) {
    console.error("❌ Error in openRazorpayCheckout:", error);
    onFailure(
      error instanceof Error
        ? error
        : new Error("Failed to open payment gateway")
    );
  }
};
