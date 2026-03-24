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
    "id"?: number,
    "name": string,
    "description": string,
    "created_at"?: string,
    "total_question"?: number,
    "total_points"?: number,
    "region"?: Region
}

export type Region = {
    "id": number,
    "name": string
}
