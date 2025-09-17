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
    PostgrestVersion: "13.0.5"
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
      account_contacts: {
        Row: {
          account_id: string
          active: boolean
          contact_id: string
          created_at: string
          email: string | null
          is_primary: boolean
          name: string
          notes: string | null
          phone: string | null
          site_id: string | null
          title: string | null
        }
        Insert: {
          account_id: string
          active?: boolean
          contact_id?: string
          created_at?: string
          email?: string | null
          is_primary?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          site_id?: string | null
          title?: string | null
        }
        Update: {
          account_id?: string
          active?: boolean
          contact_id?: string
          created_at?: string
          email?: string | null
          is_primary?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          site_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_contacts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["site_id"]
          },
        ]
      }
      accounts: {
        Row: {
          account_id: string
          created_at: string
          main_email: string | null
          main_phone: string | null
          name: string
          region: string | null
          type: string
        }
        Insert: {
          account_id?: string
          created_at?: string
          main_email?: string | null
          main_phone?: string | null
          name: string
          region?: string | null
          type?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          main_email?: string | null
          main_phone?: string | null
          name?: string
          region?: string | null
          type?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          attachment_id: string
          caption: string | null
          entity_id: string
          entity_type: string
          file_url: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          attachment_id?: string
          caption?: string | null
          entity_id: string
          entity_type: string
          file_url: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          attachment_id?: string
          caption?: string | null
          entity_id?: string
          entity_type?: string
          file_url?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      deliveries: {
        Row: {
          account_id: string
          created_at: string
          delivered_by: string | null
          delivery_date: string
          delivery_id: string
          notes: string | null
          site_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          delivered_by?: string | null
          delivery_date: string
          delivery_id?: string
          notes?: string | null
          site_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          delivered_by?: string | null
          delivery_date?: string
          delivery_id?: string
          notes?: string | null
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "deliveries_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "deliveries_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["site_id"]
          },
        ]
      }
      delivery_items: {
        Row: {
          created_at: string
          delivery_id: string
          delivery_item_id: string
          equipment_id: string
          status_at_delivery: string | null
        }
        Insert: {
          created_at?: string
          delivery_id: string
          delivery_item_id?: string
          equipment_id: string
          status_at_delivery?: string | null
        }
        Update: {
          created_at?: string
          delivery_id?: string
          delivery_item_id?: string
          equipment_id?: string
          status_at_delivery?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_items_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["delivery_id"]
          },
          {
            foreignKeyName: "delivery_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
        ]
      }
      employees: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          employee_id: string
          mobile: string | null
          name: string
          password_hash: string
          role: string
          title: string | null
          username: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          employee_id?: string
          mobile?: string | null
          name: string
          password_hash: string
          role?: string
          title?: string | null
          username: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          employee_id?: string
          mobile?: string | null
          name?: string
          password_hash?: string
          role?: string
          title?: string | null
          username?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          code: string
          created_at: string
          equipment_id: string
          installed_at: string | null
          installed_site_id: string | null
          last_inspection_at: string | null
          last_service_at: string | null
          model_id: string | null
          name: string
          next_inspection_due: string | null
          notes: string | null
          purchase_type: string
          serial_no: string
          status: string
          warranty_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          equipment_id?: string
          installed_at?: string | null
          installed_site_id?: string | null
          last_inspection_at?: string | null
          last_service_at?: string | null
          model_id?: string | null
          name: string
          next_inspection_due?: string | null
          notes?: string | null
          purchase_type: string
          serial_no: string
          status?: string
          warranty_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          equipment_id?: string
          installed_at?: string | null
          installed_site_id?: string | null
          last_inspection_at?: string | null
          last_service_at?: string | null
          model_id?: string | null
          name?: string
          next_inspection_due?: string | null
          notes?: string | null
          purchase_type?: string
          serial_no?: string
          status?: string
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_installed_site_id_fkey"
            columns: ["installed_site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["site_id"]
          },
          {
            foreignKeyName: "equipment_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "equipment_models"
            referencedColumns: ["model_id"]
          },
        ]
      }
      equipment_models: {
        Row: {
          category: string | null
          created_at: string
          model_id: string
          model_name: string
          spec: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          model_id?: string
          model_name: string
          spec?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          model_id?: string
          model_name?: string
          spec?: Json | null
        }
        Relationships: []
      }
      exports_log: {
        Row: {
          created_at: string
          employee_id: string | null
          export_id: string
          filter_json: Json | null
          module: string
          row_count: number | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          export_id?: string
          filter_json?: Json | null
          module: string
          row_count?: number | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          export_id?: string
          filter_json?: Json | null
          module?: string
          row_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_log_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      inspections: {
        Row: {
          attachments: Json | null
          certificate_no: string | null
          created_at: string
          equipment_id: string
          inspection_id: string
          next_due_at: string | null
          notes: string | null
          performed_at: string
          provider: string | null
          result: string
          type: string
        }
        Insert: {
          attachments?: Json | null
          certificate_no?: string | null
          created_at?: string
          equipment_id: string
          inspection_id?: string
          next_due_at?: string | null
          notes?: string | null
          performed_at: string
          provider?: string | null
          result?: string
          type?: string
        }
        Update: {
          attachments?: Json | null
          certificate_no?: string | null
          created_at?: string
          equipment_id?: string
          inspection_id?: string
          next_due_at?: string | null
          notes?: string | null
          performed_at?: string
          provider?: string | null
          result?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
        ]
      }
      service_tickets: {
        Row: {
          account_id: string
          action: string | null
          assigned_to: string | null
          cause: string | null
          completed_at: string | null
          created_at: string
          equipment_id: string
          notes: string | null
          photos: Json | null
          priority: string
          requested_at: string
          site_id: string
          status: string
          symptom: string
          ticket_id: string
        }
        Insert: {
          account_id: string
          action?: string | null
          assigned_to?: string | null
          cause?: string | null
          completed_at?: string | null
          created_at?: string
          equipment_id: string
          notes?: string | null
          photos?: Json | null
          priority?: string
          requested_at?: string
          site_id: string
          status?: string
          symptom: string
          ticket_id?: string
        }
        Update: {
          account_id?: string
          action?: string | null
          assigned_to?: string | null
          cause?: string | null
          completed_at?: string | null
          created_at?: string
          equipment_id?: string
          notes?: string | null
          photos?: Json | null
          priority?: string
          requested_at?: string
          site_id?: string
          status?: string
          symptom?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_tickets_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "service_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "service_tickets_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "service_tickets_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["site_id"]
          },
        ]
      }
      sites: {
        Row: {
          account_id: string
          address: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          name: string
          site_id: string
        }
        Insert: {
          account_id: string
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          name: string
          site_id?: string
        }
        Update: {
          account_id?: string
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          name?: string
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
