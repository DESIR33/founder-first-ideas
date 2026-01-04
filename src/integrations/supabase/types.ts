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
  public: {
    Tables: {
      dismissed_ideas: {
        Row: {
          dismissed_at: string | null
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          dismissed_at?: string | null
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          dismissed_at?: string | null
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: []
      }
      idea_collection_items: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          idea_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          idea_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          idea_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "idea_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_collections: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      idea_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          idea_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          idea_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          idea_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          anti_patterns: string[] | null
          audience_platform: string | null
          audience_size: number | null
          blind_spots: string[] | null
          builder_vs_optimizer: number | null
          capital_available: string | null
          created_at: string | null
          employment_status: string | null
          execution_strengths: string[] | null
          founder_type: string | null
          geographic_limits: boolean | null
          has_audience: boolean | null
          has_completed_onboarding: boolean | null
          has_family_obligations: boolean | null
          has_legal_restrictions: boolean | null
          has_sales_experience: boolean | null
          has_video_skills: boolean | null
          has_writing_skills: boolean | null
          hours_per_week: number | null
          id: string
          ideal_business_models: string[] | null
          industry_experience: string[] | null
          marketing_comfort: number | null
          monthly_income_goal: number | null
          needs_predictability: boolean | null
          preferred_business_type: string | null
          preferred_models: string[] | null
          risk_tolerance: number | null
          role_preference: string | null
          stress_tolerance: number | null
          structure_vs_ambiguity: number | null
          team_preference: string | null
          technical_ability: string | null
          time_horizon: string | null
          updated_at: string | null
          user_id: string
          visionary_vs_executor: number | null
          weekly_capacity_score: number | null
        }
        Insert: {
          anti_patterns?: string[] | null
          audience_platform?: string | null
          audience_size?: number | null
          blind_spots?: string[] | null
          builder_vs_optimizer?: number | null
          capital_available?: string | null
          created_at?: string | null
          employment_status?: string | null
          execution_strengths?: string[] | null
          founder_type?: string | null
          geographic_limits?: boolean | null
          has_audience?: boolean | null
          has_completed_onboarding?: boolean | null
          has_family_obligations?: boolean | null
          has_legal_restrictions?: boolean | null
          has_sales_experience?: boolean | null
          has_video_skills?: boolean | null
          has_writing_skills?: boolean | null
          hours_per_week?: number | null
          id?: string
          ideal_business_models?: string[] | null
          industry_experience?: string[] | null
          marketing_comfort?: number | null
          monthly_income_goal?: number | null
          needs_predictability?: boolean | null
          preferred_business_type?: string | null
          preferred_models?: string[] | null
          risk_tolerance?: number | null
          role_preference?: string | null
          stress_tolerance?: number | null
          structure_vs_ambiguity?: number | null
          team_preference?: string | null
          technical_ability?: string | null
          time_horizon?: string | null
          updated_at?: string | null
          user_id: string
          visionary_vs_executor?: number | null
          weekly_capacity_score?: number | null
        }
        Update: {
          anti_patterns?: string[] | null
          audience_platform?: string | null
          audience_size?: number | null
          blind_spots?: string[] | null
          builder_vs_optimizer?: number | null
          capital_available?: string | null
          created_at?: string | null
          employment_status?: string | null
          execution_strengths?: string[] | null
          founder_type?: string | null
          geographic_limits?: boolean | null
          has_audience?: boolean | null
          has_completed_onboarding?: boolean | null
          has_family_obligations?: boolean | null
          has_legal_restrictions?: boolean | null
          has_sales_experience?: boolean | null
          has_video_skills?: boolean | null
          has_writing_skills?: boolean | null
          hours_per_week?: number | null
          id?: string
          ideal_business_models?: string[] | null
          industry_experience?: string[] | null
          marketing_comfort?: number | null
          monthly_income_goal?: number | null
          needs_predictability?: boolean | null
          preferred_business_type?: string | null
          preferred_models?: string[] | null
          risk_tolerance?: number | null
          role_preference?: string | null
          stress_tolerance?: number | null
          structure_vs_ambiguity?: number | null
          team_preference?: string | null
          technical_ability?: string | null
          time_horizon?: string | null
          updated_at?: string | null
          user_id?: string
          visionary_vs_executor?: number | null
          weekly_capacity_score?: number | null
        }
        Relationships: []
      }
      saved_ideas: {
        Row: {
          id: string
          idea_data: Json
          idea_id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          idea_data: Json
          idea_id: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          idea_data?: Json
          idea_id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
