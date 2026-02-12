export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          password_hash: string
          status: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          password_hash: string
          status?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          password_hash?: string
          status?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      competition_prizes: {
        Row: {
          cash_prize: number | null
          competition_id: string
          created_at: string | null
          description: string | null
          id: string
          prize_type: string | null
          rank: number
          title: string
          worth: number | null
        }
        Insert: {
          cash_prize?: number | null
          competition_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          prize_type?: string | null
          rank: number
          title: string
          worth?: number | null
        }
        Update: {
          cash_prize?: number | null
          competition_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          prize_type?: string | null
          rank?: number
          title?: string
          worth?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_prizes_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_prizes_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_question_banks: {
        Row: {
          competition_id: string
          created_at: string | null
          grades: number[]
          id: string
          question_bank_id: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          grades: number[]
          id?: string
          question_bank_id: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          grades?: number[]
          id?: string
          question_bank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_question_banks_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_question_banks_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_question_banks_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_question_banks_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_syllabus: {
        Row: {
          competition_id: string
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          topic: string
        }
        Insert: {
          competition_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          topic: string
        }
        Update: {
          competition_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_syllabus_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_syllabus_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string | null
          description: string
          duration: number
          enrolled_count: number | null
          enrollment_fee: number
          exam_date: string
          exam_window_end: string
          exam_window_start: string
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          is_results_published: boolean | null
          is_training_available: boolean | null
          max_grade: number
          min_grade: number
          original_fee: number | null
          registration_end_date: string
          registration_start_date: string
          results_date: string | null
          season: string
          seats_limit: number | null
          slug: string
          status: string | null
          title: string
          total_marks: number | null
          total_questions: number | null
          updated_at: string | null
          view_count: number | null
          waitlist_count: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: number
          enrolled_count?: number | null
          enrollment_fee?: number
          exam_date: string
          exam_window_end: string
          exam_window_start: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_results_published?: boolean | null
          is_training_available?: boolean | null
          max_grade: number
          min_grade: number
          original_fee?: number | null
          registration_end_date: string
          registration_start_date: string
          results_date?: string | null
          season: string
          seats_limit?: number | null
          slug: string
          status?: string | null
          title: string
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
          view_count?: number | null
          waitlist_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: number
          enrolled_count?: number | null
          enrollment_fee?: number
          exam_date?: string
          exam_window_end?: string
          exam_window_start?: string
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_results_published?: boolean | null
          is_training_available?: boolean | null
          max_grade?: number
          min_grade?: number
          original_fee?: number | null
          registration_end_date?: string
          registration_start_date?: string
          results_date?: string | null
          season?: string
          seats_limit?: number | null
          slug?: string
          status?: string | null
          title?: string
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
          view_count?: number | null
          waitlist_count?: number | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          grade: number
          id: string
          message: string | null
          parent_name: string
          phone: string
          slot: string
          status: string | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          grade: number
          id?: string
          message?: string | null
          parent_name: string
          phone: string
          slot: string
          status?: string | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          grade?: number
          id?: string
          message?: string | null
          parent_name?: string
          phone?: string
          slot?: string
          status?: string | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          attribution_code: string | null
          competition_id: string
          competition_snapshot: Json
          created_at: string | null
          id: string
          is_payment_confirmed: boolean | null
          payment_id: string
          status: string | null
          submission_id: string | null
          updated_at: string | null
          user_id: string
          user_snapshot: Json
        }
        Insert: {
          attribution_code?: string | null
          competition_id: string
          competition_snapshot?: Json
          created_at?: string | null
          id?: string
          is_payment_confirmed?: boolean | null
          payment_id: string
          status?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id: string
          user_snapshot?: Json
        }
        Update: {
          attribution_code?: string | null
          competition_id?: string
          competition_snapshot?: Json
          created_at?: string | null
          id?: string
          is_payment_confirmed?: boolean | null
          payment_id?: string
          status?: string | null
          submission_id?: string | null
          updated_at?: string | null
          user_id?: string
          user_snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_submission"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "competition_leaderboard"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "fk_enrollment_submission"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollment_submission"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "user_submission_history"
            referencedColumns: ["submission_id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          answers: Json | null
          created_at: string | null
          duration_minutes: number
          end_time: string
          exam_id: string
          exam_type: string
          expires_at: string
          id: string
          is_locked: boolean | null
          session_token: string
          start_time: string
          status: string | null
          submission_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string | null
          duration_minutes: number
          end_time: string
          exam_id: string
          exam_type: string
          expires_at: string
          id?: string
          is_locked?: boolean | null
          session_token: string
          start_time: string
          status?: string | null
          submission_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          created_at?: string | null
          duration_minutes?: number
          end_time?: string
          exam_id?: string
          exam_type?: string
          expires_at?: string
          id?: string
          is_locked?: boolean | null
          session_token?: string
          start_time?: string
          status?: string | null
          submission_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_sessions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "competition_leaderboard"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "exam_sessions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_sessions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "user_submission_history"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "exam_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_test_question_banks: {
        Row: {
          created_at: string | null
          grades: number[]
          id: string
          mock_test_id: string
          question_bank_id: string
        }
        Insert: {
          created_at?: string | null
          grades: number[]
          id?: string
          mock_test_id: string
          question_bank_id: string
        }
        Update: {
          created_at?: string | null
          grades?: number[]
          id?: string
          mock_test_id?: string
          question_bank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_test_question_banks_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_question_banks_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_question_banks_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_test_question_banks_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_tests: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          description: string
          difficulty: string
          duration: number
          id: string
          is_active: boolean | null
          is_locked: boolean | null
          is_published: boolean | null
          max_grade: number | null
          min_grade: number | null
          sort_order: number | null
          tags: string[] | null
          title: string
          total_questions: number
          updated_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          description: string
          difficulty: string
          duration: number
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          sort_order?: number | null
          tags?: string[] | null
          title: string
          total_questions: number
          updated_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          description?: string
          difficulty?: string
          duration?: number
          id?: string
          is_active?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          total_questions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          base_amount: number | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          gateway: string | null
          gateway_response: Json | null
          gst_amount: number | null
          id: string
          purpose: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          reference_id: string
          status: string | null
          updated_at: string | null
          user_id: string
          user_snapshot: Json | null
        }
        Insert: {
          amount: number
          base_amount?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway?: string | null
          gateway_response?: Json | null
          gst_amount?: number | null
          id?: string
          purpose: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          reference_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          user_snapshot?: Json | null
        }
        Update: {
          amount?: number
          base_amount?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          gateway?: string | null
          gateway_response?: Json | null
          gst_amount?: number | null
          id?: string
          purpose?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          reference_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          user_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_provider: string
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          email_verified: boolean | null
          id: string
          is_profile_complete: boolean | null
          last_login: string | null
          parent_name: string | null
          phone: string | null
          referral_source: string | null
          referred_by_code: string | null
          registration_source: string | null
          role: string | null
          school_name: string | null
          state: string | null
          status: string | null
          student_grade: number | null
          student_name: string | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          auth_provider: string
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          id: string
          is_profile_complete?: boolean | null
          last_login?: string | null
          parent_name?: string | null
          phone?: string | null
          referral_source?: string | null
          referred_by_code?: string | null
          registration_source?: string | null
          role?: string | null
          school_name?: string | null
          state?: string | null
          status?: string | null
          student_grade?: number | null
          student_name?: string | null
          uid: string
          updated_at?: string | null
        }
        Update: {
          auth_provider?: string
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          id?: string
          is_profile_complete?: boolean | null
          last_login?: string | null
          parent_name?: string | null
          phone?: string | null
          referral_source?: string | null
          referred_by_code?: string | null
          registration_source?: string | null
          role?: string | null
          school_name?: string | null
          state?: string | null
          status?: string | null
          student_grade?: number | null
          student_name?: string | null
          uid?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      question_banks: {
        Row: {
          bank_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          max_grade: number | null
          min_grade: number | null
          status: string | null
          tags: string[] | null
          title: string
          total_marks: number | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          bank_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          total_marks?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          bank_type?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          total_marks?: number | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_banks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          id: string
          option_index: number
          question_id: string
          text: string
        }
        Insert: {
          id?: string
          option_index: number
          question_id: string
          text: string
        }
        Update: {
          id?: string
          option_index?: number
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer: number | null
          correct_option_index: number
          created_at: string | null
          digits: number | null
          id: string
          image_url: string | null
          is_auto_generated: boolean | null
          marks: number | null
          operations: Json | null
          operator_type: string | null
          question_bank_id: string
          question_text: string
          rows_count: number | null
          sort_order: number | null
          type: string | null
        }
        Insert: {
          correct_answer?: number | null
          correct_option_index: number
          created_at?: string | null
          digits?: number | null
          id?: string
          image_url?: string | null
          is_auto_generated?: boolean | null
          marks?: number | null
          operations?: Json | null
          operator_type?: string | null
          question_bank_id: string
          question_text: string
          rows_count?: number | null
          sort_order?: number | null
          type?: string | null
        }
        Update: {
          correct_answer?: number | null
          correct_option_index?: number
          created_at?: string | null
          digits?: number | null
          id?: string
          image_url?: string | null
          is_auto_generated?: boolean | null
          marks?: number | null
          operations?: Json | null
          operator_type?: string | null
          question_bank_id?: string
          question_text?: string
          rows_count?: number | null
          sort_order?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_question_bank_id_fkey"
            columns: ["question_bank_id"]
            isOneToOne: false
            referencedRelation: "question_banks_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      referrer_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
          referral_code: string
          successful_conversions: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone: string
          referral_code: string
          successful_conversions?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          referral_code?: string
          successful_conversions?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrers: {
        Row: {
          code: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      submission_answers: {
        Row: {
          answered_at: string | null
          correct_option_index: number
          id: string
          is_correct: boolean
          marks: number | null
          question_id: string
          question_text: string | null
          selected_option_index: number
          submission_id: string
        }
        Insert: {
          answered_at?: string | null
          correct_option_index: number
          id?: string
          is_correct: boolean
          marks?: number | null
          question_id: string
          question_text?: string | null
          selected_option_index: number
          submission_id: string
        }
        Update: {
          answered_at?: string | null
          correct_option_index?: number
          id?: string
          is_correct?: boolean
          marks?: number | null
          question_id?: string
          question_text?: string | null
          selected_option_index?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "competition_leaderboard"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "submission_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "user_submission_history"
            referencedColumns: ["submission_id"]
          },
        ]
      }
      submissions: {
        Row: {
          competition_id: string | null
          correct_answers: number | null
          created_at: string | null
          exam_snapshot: Json
          exam_type: string
          id: string
          incorrect_answers: number | null
          mock_test_id: string | null
          rank: number | null
          score: number | null
          started_at: string
          status: string | null
          submitted_at: string | null
          time_taken: number | null
          total_questions: number
          unanswered: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          competition_id?: string | null
          correct_answers?: number | null
          created_at?: string | null
          exam_snapshot?: Json
          exam_type: string
          id?: string
          incorrect_answers?: number | null
          mock_test_id?: string | null
          rank?: number | null
          score?: number | null
          started_at: string
          status?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_questions: number
          unanswered?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          competition_id?: string | null
          correct_answers?: number | null
          created_at?: string | null
          exam_snapshot?: Json
          exam_type?: string
          id?: string
          incorrect_answers?: number | null
          mock_test_id?: string | null
          rank?: number | null
          score?: number | null
          started_at?: string
          status?: string | null
          submitted_at?: string | null
          time_taken?: number | null
          total_questions?: number
          unanswered?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mock_test_attempts: {
        Row: {
          created_at: string | null
          id: string
          mock_test_id: string
          submission_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mock_test_id: string
          submission_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mock_test_id?: string
          submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mock_test_attempts_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mock_test_attempts_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mock_test_attempts_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "competition_leaderboard"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "user_mock_test_attempts_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mock_test_attempts_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "user_submission_history"
            referencedColumns: ["submission_id"]
          },
          {
            foreignKeyName: "user_mock_test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          active_competitions: number | null
          active_mock_tests: number | null
          new_users_30d: number | null
          successful_payments: number | null
          total_enrollments: number | null
          total_revenue_paise: number | null
          total_submissions: number | null
          total_users: number | null
        }
        Relationships: []
      }
      competition_leaderboard: {
        Row: {
          city: string | null
          competition_id: string | null
          correct_answers: number | null
          rank: number | null
          school_name: string | null
          score: number | null
          student_grade: number | null
          student_name: string | null
          submission_id: string | null
          submitted_at: string | null
          time_taken: number | null
          total_questions: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions_with_status: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          enrolled_count: number | null
          enrollment_fee: number | null
          exam_date: string | null
          exam_window_end: string | null
          exam_window_start: string | null
          id: string | null
          is_exam_active: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          is_registration_open: boolean | null
          is_results_published: boolean | null
          is_training_available: boolean | null
          max_grade: number | null
          min_grade: number | null
          original_fee: number | null
          registration_end_date: string | null
          registration_start_date: string | null
          results_date: string | null
          season: string | null
          seats_limit: number | null
          seats_remaining: number | null
          slug: string | null
          status: string | null
          title: string | null
          total_marks: number | null
          total_questions: number | null
          updated_at: string | null
          view_count: number | null
          waitlist_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          enrolled_count?: number | null
          enrollment_fee?: number | null
          exam_date?: string | null
          exam_window_end?: string | null
          exam_window_start?: string | null
          id?: string | null
          is_exam_active?: never
          is_featured?: boolean | null
          is_published?: boolean | null
          is_registration_open?: never
          is_results_published?: boolean | null
          is_training_available?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          original_fee?: number | null
          registration_end_date?: string | null
          registration_start_date?: string | null
          results_date?: string | null
          season?: string | null
          seats_limit?: number | null
          seats_remaining?: never
          slug?: string | null
          status?: string | null
          title?: string | null
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
          view_count?: number | null
          waitlist_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          enrolled_count?: number | null
          enrollment_fee?: number | null
          exam_date?: string | null
          exam_window_end?: string | null
          exam_window_start?: string | null
          id?: string | null
          is_exam_active?: never
          is_featured?: boolean | null
          is_published?: boolean | null
          is_registration_open?: never
          is_results_published?: boolean | null
          is_training_available?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          original_fee?: number | null
          registration_end_date?: string | null
          registration_start_date?: string | null
          results_date?: string | null
          season?: string | null
          seats_limit?: number | null
          seats_remaining?: never
          slug?: string | null
          status?: string | null
          title?: string | null
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string | null
          view_count?: number | null
          waitlist_count?: number | null
        }
        Relationships: []
      }
      mock_tests_with_status: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration: number | null
          id: string | null
          is_active: boolean | null
          is_locked: boolean | null
          is_published: boolean | null
          max_grade: number | null
          min_grade: number | null
          sort_order: number | null
          status: string | null
          tags: string[] | null
          title: string | null
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          sort_order?: number | null
          status?: never
          tags?: string[] | null
          title?: string | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: number | null
          id?: string | null
          is_active?: boolean | null
          is_locked?: boolean | null
          is_published?: boolean | null
          max_grade?: number | null
          min_grade?: number | null
          sort_order?: number | null
          status?: never
          tags?: string[] | null
          title?: string | null
          total_questions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      question_banks_summary: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          max_grade: number | null
          min_grade: number | null
          question_count: number | null
          tags: string[] | null
          title: string | null
          total_marks: number | null
        }
        Relationships: []
      }
      user_enrollments_detail: {
        Row: {
          can_start_exam: boolean | null
          competition_id: string | null
          competition_slug: string | null
          competition_snapshot: Json | null
          competition_status: string | null
          competition_title: string | null
          duration: number | null
          enrolled_at: string | null
          enrollment_id: string | null
          enrollment_status: string | null
          exam_date: string | null
          exam_window_end: string | null
          exam_window_start: string | null
          has_submitted: boolean | null
          is_payment_confirmed: boolean | null
          submission_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_submission_history: {
        Row: {
          competition_id: string | null
          correct_answers: number | null
          exam_snapshot: Json | null
          exam_title: string | null
          exam_type: string | null
          incorrect_answers: number | null
          mock_test_id: string | null
          percentage_score: number | null
          rank: number | null
          score: number | null
          started_at: string | null
          status: string | null
          submission_id: string | null
          submitted_at: string | null
          time_taken: number | null
          total_questions: number | null
          unanswered: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_mock_test_id_fkey"
            columns: ["mock_test_id"]
            isOneToOne: false
            referencedRelation: "mock_tests_with_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_submission_score: {
        Args: { p_submission_id: string }
        Returns: {
          correct_count: number
          incorrect_count: number
          total_score: number
          unanswered_count: number
        }[]
      }
      cleanup_expired_exam_sessions: { Args: never; Returns: number }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_registration_open: {
        Args: {
          competition_row: Database["public"]["Tables"]["competitions"]["Row"]
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
