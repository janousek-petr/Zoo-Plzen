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
    created_at: string
    total_points: number | string
    total_questions: number
    region: {
        id: number
        name: string
    } | null
}

export type Region = {
    "id": number,
    "name": string
}
