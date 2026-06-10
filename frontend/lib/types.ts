export type Answer = {
    "id"?: number,
    "question_id"?: number,
    "text"?: string,
    "correct_input"?: string,
    "is_correct"?: 0|1,
    "image"?: string
}

export type Question = {
    "id"?: number,
    "text": string,
    "points"?: number,
    "category"?: {
        "id": number,
        "name"?: string
    }
    "image"?: string,
    "answers": Answer[]
}

export type Quiz = {
    id: number
    name: string
    description: string | null
    level: number
    is_published: boolean
    created_at: string
    total_points: number | string
    total_questions: number
    region: {
        id: number
        name: string
    } | null
    region_id?: number | null
}

export type Region = {
    "id": number,
    "name": string
}

export type MediaItem = {
    id: number;
    filename: string;
    path: string;
    mime_type: string;
    size: number;
    created_at: string;
};

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active?: boolean;
  created_at?: string;
  profiles?: Profile[];       // pro detail
  profiles_count?: number;    // pro výpis (withCount z Laravelu)
}

export type Profile = {
  id: number;
  user_id: number;            // vazba na účet
  first_name: string;
  last_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  accessory_url: string | null;
  wallpaper_url: string | null;
  level: number;
  xp: number;
}