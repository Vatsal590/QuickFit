export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Email: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      fitness_profiles: {
        Row: {
          available_equipment: string[]
          body_type: string
          created_at: string
          fitness_goal: string
          height: number
          id: string
          updated_at: string
          user_id: string
          weight: number
          workout_days_per_week: number
        }
        Insert: {
          available_equipment?: string[]
          body_type: string
          created_at?: string
          fitness_goal: string
          height: number
          id?: string
          updated_at?: string
          user_id: string
          weight: number
          workout_days_per_week: number
        }
        Update: {
          available_equipment?: string[]
          body_type?: string
          created_at?: string
          fitness_goal?: string
          height?: number
          id?: string
          updated_at?: string
          user_id?: string
          weight?: number
          workout_days_per_week?: number
        }
        Relationships: []
      }
      lastused: {
        Row: {
          id: number
          lastused_at: string
        }
        Insert: {
          id?: number
          lastused_at?: string
        }
        Update: {
          id?: number
          lastused_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_active: string | null
          last_used: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_active?: string | null
          last_used?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_active?: string | null
          last_used?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          daily_workouts: Json
          fitness_goal: string
          id: string
          is_active: boolean
          plan_name: string
          profile_id: string
          total_days: number
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_workouts: Json
          fitness_goal: string
          id?: string
          is_active?: boolean
          plan_name: string
          profile_id: string
          total_days?: number
          user_id: string
        }
        Update: {
          created_at?: string
          daily_workouts?: Json
          fitness_goal?: string
          id?: string
          is_active?: boolean
          plan_name?: string
          profile_id?: string
          total_days?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "fitness_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          cooldown_exercises: Json
          created_at: string
          duration: number
          equipment: string[]
          exercises: Json
          id: string
          intensity: string
          target_muscle_groups: string[]
          title: string
          user_id: string
          warmup_exercises: Json
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          cooldown_exercises: Json
          created_at?: string
          duration: number
          equipment: string[]
          exercises: Json
          id?: string
          intensity: string
          target_muscle_groups: string[]
          title: string
          user_id: string
          warmup_exercises: Json
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          cooldown_exercises?: Json
          created_at?: string
          duration?: number
          equipment?: string[]
          exercises?: Json
          id?: string
          intensity?: string
          target_muscle_groups?: string[]
          title?: string
          user_id?: string
          warmup_exercises?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_last_used: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
