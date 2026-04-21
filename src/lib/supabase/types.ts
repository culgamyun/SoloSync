export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          locale: 'ko' | 'en';
          timezone: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: 'ko' | 'en';
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: 'ko' | 'en';
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          living_situation: 'alone' | 'with_partner' | 'with_family' | 'with_roommates' | null;
          city: string | null;
          social_satisfaction_score: number | null;
          introversion_level: number | null;
          relationship_map: Json;
          barriers: string[];
          goals: string[];
          comfort_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          living_situation?: 'alone' | 'with_partner' | 'with_family' | 'with_roommates' | null;
          city?: string | null;
          social_satisfaction_score?: number | null;
          introversion_level?: number | null;
          relationship_map?: Json;
          barriers?: string[];
          goals?: string[];
          comfort_level?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          living_situation?: 'alone' | 'with_partner' | 'with_family' | 'with_roommates' | null;
          city?: string | null;
          social_satisfaction_score?: number | null;
          introversion_level?: number | null;
          relationship_map?: Json;
          barriers?: string[];
          goals?: string[];
          comfort_level?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          user_id: string;
          week_number: number;
          week_start_date: string;
          title: string;
          description: string;
          difficulty: 'easy' | 'medium' | 'hard';
          category: 'reach_out' | 'deepen' | 'explore' | 'maintain';
          estimated_time: '10min' | '30min' | '1hr' | '2hr+';
          conversation_starters: string[];
          mission_kind: 'standard' | 'micro_social';
          mission_context: string | null;
          safe_line: string | null;
          minimum_win: string | null;
          fear: string | null;
          reframe: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'skipped';
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_number: number;
          week_start_date: string;
          title: string;
          description: string;
          difficulty: 'easy' | 'medium' | 'hard';
          category: 'reach_out' | 'deepen' | 'explore' | 'maintain';
          estimated_time?: '10min' | '30min' | '1hr' | '2hr+';
          conversation_starters?: string[];
          mission_kind?: 'standard' | 'micro_social';
          mission_context?: string | null;
          safe_line?: string | null;
          minimum_win?: string | null;
          fear?: string | null;
          reframe?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_number?: number;
          week_start_date?: string;
          title?: string;
          description?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          category?: 'reach_out' | 'deepen' | 'explore' | 'maintain';
          estimated_time?: '10min' | '30min' | '1hr' | '2hr+';
          conversation_starters?: string[];
          mission_kind?: 'standard' | 'micro_social';
          mission_context?: string | null;
          safe_line?: string | null;
          minimum_win?: string | null;
          fear?: string | null;
          reframe?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenge_reflections: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          mood_before: number | null;
          mood_after: number | null;
          difficulty_felt: number | null;
          outcome: 'greeted' | 'said_line' | 'could_not_do_it' | null;
          reflection_text: string | null;
          ai_feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          mood_before?: number | null;
          mood_after?: number | null;
          difficulty_felt?: number | null;
          outcome?: 'greeted' | 'said_line' | 'could_not_do_it' | null;
          reflection_text?: string | null;
          ai_feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          mood_before?: number | null;
          mood_after?: number | null;
          difficulty_felt?: number | null;
          outcome?: 'greeted' | 'said_line' | 'could_not_do_it' | null;
          reflection_text?: string | null;
          ai_feedback?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      challenge_mission_adjustments: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          request_type: 'smaller' | 'different_space' | 'safer_line';
          previous_mission: Json;
          next_mission: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          request_type: 'smaller' | 'different_space' | 'safer_line';
          previous_mission: Json;
          next_mission: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          request_type?: 'smaller' | 'different_space' | 'safer_line';
          previous_mission?: Json;
          next_mission?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      social_health_scores: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          insight: string | null;
          breakdown: Json;
          measured_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          insight?: string | null;
          breakdown: Json;
          measured_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          insight?: string | null;
          breakdown?: Json;
          measured_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      coaching_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: 'coaching' | 'reflection' | 'check_in' | 'crisis_redirect';
          summary: string | null;
          turn_count: number;
          last_message_at: string | null;
          started_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: 'coaching' | 'reflection' | 'check_in' | 'crisis_redirect';
          summary?: string | null;
          turn_count?: number;
          last_message_at?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: 'coaching' | 'reflection' | 'check_in' | 'crisis_redirect';
          summary?: string | null;
          turn_count?: number;
          last_message_at?: string | null;
          started_at?: string;
          ended_at?: string | null;
        };
        Relationships: [];
      };
      coaching_messages: {
        Row: {
          id: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          total_challenges_completed: number;
          level: 'bronze' | 'silver' | 'gold' | 'platinum';
          xp: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          total_challenges_completed?: number;
          level?: 'bronze' | 'silver' | 'gold' | 'platinum';
          xp?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          total_challenges_completed?: number;
          level?: 'bronze' | 'silver' | 'gold' | 'platinum';
          xp?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weekly_check_ins: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          satisfaction_score: number;
          energy_score: number;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          satisfaction_score: number;
          energy_score: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          satisfaction_score?: number;
          energy_score?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      micro_mission_return_report: {
        Args: Record<string, never>;
        Returns: {
          failed_week_start_date: string;
          failed_or_skipped_users: number;
          returned_next_week_users: number;
          next_week_return_rate: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;
type DefaultSchema = DatabaseWithoutInternals['public'];

export type Tables<
  PublicTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends { Row: infer Row }
    ? Row
    : never
  : PublicTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[PublicTableNameOrOptions] extends { Row: infer Row }
      ? Row
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends { Insert: infer Insert }
    ? Insert
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][PublicTableNameOrOptions] extends { Insert: infer Insert }
      ? Insert
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends { Update: infer Update }
    ? Update
    : never
  : PublicTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][PublicTableNameOrOptions] extends { Update: infer Update }
      ? Update
      : never
    : never;
