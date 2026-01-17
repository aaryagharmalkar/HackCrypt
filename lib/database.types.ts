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
      bank_accounts: {
        Row: {
          bank_name: string
          created_at: string | null
          id: string
          masked_account: string
          user_id: string
        }
        Insert: {
          bank_name: string
          created_at?: string | null
          id?: string
          masked_account: string
          user_id: string
        }
        Update: {
          bank_name?: string
          created_at?: string | null
          id?: string
          masked_account?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          limit_amount: number
          name: string
          period: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          limit_amount: number
          name: string
          period?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          limit_amount?: number
          name?: string
          period?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cibil_recommendations: {
        Row: {
          cibil_score: number | null
          created_at: string | null
          description: string | null
          id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          cibil_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          cibil_score?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          avg_expense: number | null
          avg_income: number | null
          created_at: string | null
          emi_count: number | null
          expense_ratio: number | null
          id: string
          months_tracked: number | null
          user_id: string | null
        }
        Insert: {
          avg_expense?: number | null
          avg_income?: number | null
          created_at?: string | null
          emi_count?: number | null
          expense_ratio?: number | null
          id?: string
          months_tracked?: number | null
          user_id?: string | null
        }
        Update: {
          avg_expense?: number | null
          avg_income?: number | null
          created_at?: string | null
          emi_count?: number | null
          expense_ratio?: number | null
          id?: string
          months_tracked?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          saved_amount: number
          target_amount: number
          target_date: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          saved_amount?: number
          target_amount: number
          target_date: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          saved_amount?: number
          target_amount?: number
          target_date?: string
          user_id?: string
        }
        Relationships: []
      }
      income_sources: {
        Row: {
          amount: number
          created_at: string | null
          frequency: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          frequency?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          frequency?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      ingestion_logs: {
        Row: {
          bank: string
          created_at: string | null
          id: string
          month: string
          source: string
          status: string
          user_id: string
        }
        Insert: {
          bank: string
          created_at?: string | null
          id?: string
          month: string
          source: string
          status: string
          user_id: string
        }
        Update: {
          bank?: string
          created_at?: string | null
          id?: string
          month?: string
          source?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          public_url: string
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          public_url: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          public_url?: string
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tax_reports: {
        Row: {
          created_at: string | null
          id: string | null
          new_tax: number | null
          old_tax: number | null
          recommended: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          new_tax?: number | null
          old_tax?: number | null
          recommended?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          new_tax?: number | null
          old_tax?: number | null
          recommended?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      test_transactions: {
        Row: {
          amount: number
          bank_account_id: string
          category: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          month: string
          transaction_hash: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id: string
          category?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          month: string
          transaction_hash: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          month?: string
          transaction_hash?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      transaction_embeddings: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bank_account_id: string
          category: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          month: string
          transaction_hash: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id: string
          category?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          month: string
          transaction_hash: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          month?: string
          transaction_hash?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bank_account"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          currency: string | null
          email: string
          hide_global_snapshots: number | null
          id: string
          language: string | null
          last_update_timestamp: number | null
          trx_order_by: string | null
          user_key: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          email: string
          hide_global_snapshots?: number | null
          id?: string
          language?: string | null
          last_update_timestamp?: number | null
          trx_order_by?: string | null
          user_key?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          email?: string
          hide_global_snapshots?: number | null
          id?: string
          language?: string | null
          last_update_timestamp?: number | null
          trx_order_by?: string | null
          user_key?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_user_transactions: {
        Args: {
          match_count?: number
          p_user_id: string
          query_embedding: string
        }
        Returns: {
          content: string
          metadata: Json
        }[]
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
  public: {
    Enums: {},
  },
} as const

// Type aliases for easier usage
export type PDFDocument = Tables<'pdf_documents'>
export type PDFDocumentInsert = TablesInsert<'pdf_documents'>
export type PDFDocumentUpdate = TablesUpdate<'pdf_documents'>

export type Transaction = Tables<'transactions'>
export type BankAccount = Tables<'bank_accounts'>
export type Budget = Tables<'budgets'>
export type Goal = Tables<'goals'>
export type IncomeSource = Tables<'income_sources'>
export type User = Tables<'users'>