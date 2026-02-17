// ⚠️ AUTO-GENERATED — Do not edit manually.
// Regenerate with:
//   bunx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
//
// This is a placeholder so the app compiles before you generate.
// Replace this entire file with your actual output.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth0_id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "attendee" | "organizer" | "non_profit" | "admin";
          profile_data: Json;
          settings: Json;
          interests: string[];
          stripe_account_id: string | null;
          stripe_onboarding_completed: boolean;
          default_currency: string;
          last_sign_in_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          organizer_id: string;
          title: string;
          slug: string;
          description: Json | null;
          category_id: string | null;
          tags: string[] | null;
          cover_image_url: string | null;
          gallery_images: string[] | null;
          start_at: string;
          end_at: string;
          location_type: string;
          venue_name: string | null;
          address_text: string | null;
          location_lat: number | null;
          location_lng: number | null;
          city: string | null;
          status: "draft" | "published" | "cancelled" | "completed";
          seating_type: "general_admission" | "reserved";
          seating_config: Json;
          is_featured: boolean;
          platform_fee_percent: number;
          platform_fee_fixed: number;
          currency: string;
          total_capacity: number;
          total_tickets_sold: number;
          source_app: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
      };
      ticket_tiers: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          description: string | null;
          price: number;
          currency: string;
          initial_quantity: number;
          remaining_quantity: number;
          max_per_order: number;
          sales_start_at: string | null;
          sales_end_at: string | null;
          is_hidden: boolean;
        };
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          tier_id: string;
          order_id: string | null;
          user_id: string;
          attendee_name: string | null;
          attendee_email: string | null;
          qr_code_secret: string;
          status: "valid" | "used" | "cancelled" | "expired";
          seat_label: string | null;
          purchase_date: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          total_amount: number;
          platform_fee_amount: number;
          organizer_payout_amount: number;
          currency: string;
          payout_breakdown: Json;
          status: "pending" | "completed" | "refunded" | "cancelled";
          source_app: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          tier_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
      };
      revenue_splits: {
        Row: {
          id: string;
          event_id: string;
          recipient_user_id: string | null;
          recipient_stripe_id: string | null;
          percentage: number;
          source_type: "platform_fee" | "net_revenue";
          description: string | null;
          created_at: string;
        };
      };
    };
  };
};
