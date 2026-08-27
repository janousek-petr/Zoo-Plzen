'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuestion, getQuestionCategories, deleteQuestion, CATEGORY_LABEL } from '@/lib/api/quizzes'
import MediaPickerButton from '@/components/admin/media/MediaPickerButton'
import { MediaItem, Question } from "@/lib/types"
import {RiAddLine, RiCloseLine, RiDeleteBinLine} from 'react-icons/ri'

type Category = { id: number; name: string }

type AnswerForm = {
    id?: number
    text: string
    is_correct: boolean
    image?: MediaItem | null
    audio?: MediaItem | null
}

const TRUE_FALSE_ANSWERS: AnswerForm[] = [
    { text: 'Ano', is_correct: true },
    { text: 'Ne', is_correct: false },
]

interface Props {
    quizId: number
    question: Question
}

export default function EditQuestion({ quizId, question }: Props) {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        text: question.text ?? '',
        points: question.points ?? 1,
        question_category: question.category?.id ? String(question.category.id) : '',
    })

    const [image, setImage] = useState<MediaItem | null>(question.image ?? null)
    const [audio, setAudio] = useState<MediaItem | null>(question.audio ?? null)

    const [answers, setAnswers] = useState<AnswerForm[]>(
        question.answers.map(a => ({
            id: a.id,
            text: a.text ?? '',
            is_correct: a.is_correct === 1,
            image: a.image ?? null,
            audio: a.audio ?? null,
        }))
    )

    useEffect(() => {
        getQuestionCategories().then(setCategories)
    }, [])

    const selectedCategory = categories.find(c => String(c.id) === form.question_category)
    const categoryName = selectedCategory?.name ?? question.category?.name ?? ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCatId = e.target.value
        const newCat = categories.find(c => String(c.id) === newCatId)
        setForm(prev => ({ ...prev, question_category: newCatId }))

        // Pokud se vracíme k původní kategorii ze serveru
        const originalCatId = question.category?.id ? String(question.category.id) : ''

        if (originalCatId && originalCatId === newCatId) {
            setAnswers(
                question.answers.map(a => ({
                    id: a.id,
                    text: a.text ?? '',
                    is_correct: a.is_correct === 1,
                    image: a.image ?? null,
                    audio: a.audio ?? null,
                }))
            )
            return
        }

        // Pokud se vybere nová kategorie, vynulují se odpovídající políčka
        if (newCat?.name === 'true_false') {
            setAnswers(TRUE_FALSE_ANSWERS)
        } else if (newCat?.name === 'select') {
            setAnswers([
                { text: '', is_correct: false },
                { text: '', is_correct: false },
            ])
        } else if (newCat?.name === 'image_select') {
            setAnswers([
                { text: '', is_correct: false, image: null },
                { text: '', is_correct: false, image: null },
            ])
        } else if (newCat?.name === 'audio_select') {
            setAnswers([
                { text: '', is_correct: false, audio: null },
                { text: '', is_correct: false, audio: null },
            ])
        }
    }

    const handleAnswerChange = (index: number, field: keyof AnswerForm, value: string | boolean | MediaItem | null) => {
        setAnswers(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))
    }

    const handleCorrectToggle = (index: number) => {
        if (categoryName === 'select' || categoryName === 'image_select') {
            setAnswers(prev => prev.map((a, i) => ({ ...a, is_correct: i === index })))
        } else {
            setAnswers(prev => prev.map((a, i) => i === index ? { ...a, is_correct: !a.is_correct } : a))
        }
    }

    const addAnswer = () => {
        if (categoryName === 'image_select') {
            setAnswers(prev => [...prev, { text: '', is_correct: false, image: null }])
        } else {
            setAnswers(prev => [...prev, { text: '', is_correct: false }])
        }
    }

    const removeAnswer = (index: number) => {
        if (answers.length <= 2) return
        setAnswers(prev => prev.filter((_, i) => i !== index))
    }

    const handleDelete = async () => {
        if (!confirm(`Opravdu chceš smazat otázku "${question.text}"? Smažou se i všechny odpovědi.`)) return
        try {
            await deleteQuestion(quizId, question.id!)
            router.push(`/admin/quizzes/${quizId}/questions`)
        } catch {
            alert('Nepodařilo se smazat otázku.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const hasCorrect = answers.some(a => a.is_correct)
        if (!hasCorrect) {
            setError('Musíte označit alespoň jednu správnou odpověď.')
            setLoading(false)
            return
        }

        try {
            const payload = {
                text: form.text,
                points: Number(form.points),
                question_category: Number(form.question_category),
                image: image ?? null,
                audio: audio ?? null,
                answers: answers.map(a => ({
                    id: a.id ?? null,
                    text: a.text,
                    is_correct: a.is_correct,
                    image: a.image ?? null,
                    audio: a.audio ?? null
                }))
            }
            await updateQuestion(quizId, question.id!, payload)
            router.push(`/admin/quizzes/${quizId}/questions`)
        } catch {
            setError('Nepodařilo se upravit otázku.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl ml-5">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Text otázky */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Text otázky</label>
                    <textarea
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Zadejte text otázky"
                        className="text-lg text-gray-900 outline-none placeholder:text-gray-300 resize-none"
                    />
                </div>

                {/* Obrázek a Audio otázky */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Obrázek otázky <span className="text-gray-300">(volitelné)</span></label>
                        <MediaPickerButton
                            value={image}
                            onChange={setImage}
                            label="Vybrat obrázek otázky"
                            onlyImage={true}
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Audio otázky <span className="text-gray-300">(volitelné)</span></label>
                        <MediaPickerButton
                            value={audio}
                            onChange={setAudio}
                            label="Vybrat audio otázky"
                            onlyImage={false}
                        />
                    </div>
                </div>

                {/* Body a kategorie */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Body</label>
                        <input
                            name="points"
                            type="number"
                            min={1}
                            value={form.points}
                            onChange={handleChange}
                            required
                            className="text-lg text-gray-900 outline-none"
                        />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
                        <label className="text-sm text-gray-400">Kategorie</label>
                        <select
                            name="question_category"
                            value={form.question_category}
                            onChange={handleCategoryChange}
                            required
                            className="text-lg text-gray-900 outline-none bg-transparent"
                        >
                            <option value="">-- Vyberte --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {CATEGORY_LABEL[c.name] ?? c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Odpovědi – true_false */}
                {categoryName === 'true_false' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                        <label className="text-sm text-gray-400">Správná odpověď</label>
                        <div className="flex gap-3">
                            {TRUE_FALSE_ANSWERS.map((a, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setAnswers(TRUE_FALSE_ANSWERS.map((x, j) => ({ ...x, is_correct: j === i })))}
                                    className={`flex-1 py-3 rounded-xl text-base font-medium transition-colors border-2 ${
                                        answers[i]?.is_correct
                                            ? i === 0
                                                ? 'bg-green-50 border-green-600 text-green-800'
                                                : 'bg-red-50 border-red-400 text-red-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {a.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Odpovědi – select */}
                {categoryName === 'select' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                        <label className="text-sm text-gray-400">Odpovědi <span className="text-gray-300">(zaškrtni správnou)</span></label>
                        {answers.map((answer, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="correct_answer"
                                    checked={answer.is_correct}
                                    onChange={() => handleCorrectToggle(index)}
                                    className="w-4 h-4 accent-green-600"
                                />
                                <input
                                    value={answer.text}
                                    onChange={e => handleAnswerChange(index, 'text', e.target.value)}
                                    required
                                    placeholder={`Odpověď ${index + 1}`}
                                    className="flex-1 text-lg text-gray-900 outline-none border-b border-gray-200 pb-1 placeholder:text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeAnswer(index)}
                                    disabled={answers.length <= 2}
                                    className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-0"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addAnswer}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-left"
                        >
                            + Přidat odpověď
                        </button>
                    </div>
                )}

                {/* Odpovědi – image_select */}
                {categoryName === 'image_select' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
                        <label className="text-sm text-gray-400">Odpovědi s obrázky <span className="text-gray-300">(zaškrtni správnou)</span></label>
                        <div className="grid grid-cols-2 gap-4">
                            {answers.map((answer, index) => (
                                <div key={index} className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-colors ${
                                    answer.is_correct ? 'border-green-500 bg-green-50/40' : 'border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="correct_answer"
                                            checked={answer.is_correct}
                                            onChange={() => handleCorrectToggle(index)}
                                            className="w-4 h-4 accent-green-600"
                                        />
                                        <span className="text-xs text-gray-400">Správná</span>
                                        {answers.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeAnswer(index)}
                                                className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <MediaPickerButton
                                        value={answer.image as MediaItem | null}
                                        onChange={item => handleAnswerChange(index, 'image', item)}
                                        label="Vybrat obrázek"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addAnswer}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-left"
                        >
                            + Přidat odpověď
                        </button>
                    </div>
                )}

                {!categoryName && (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-400 text-center">
                        Nejprve vyberte kategorii otázky
                    </div>
                )}

                {/* Kategorie: Výběr audia (audio_select) */}
                {categoryName === 'audio_select' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
                        <label className="text-sm text-gray-400">Odpovědi <span className="text-gray-300">(zaškrtni správnou)</span></label>
                        <div className="flex flex-col gap-3">
                            {answers.map((answer, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="add_question_correct"
                                        checked={Boolean(answer.is_correct)}
                                        onChange={() => handleCorrectToggle(index)}
                                        className="w-5 h-5 accent-green-600 cursor-pointer shrink-0"
                                    />

                                    <div className="flex-1">
                                        <MediaPickerButton
                                            value={answer.audio}
                                            onChange={item => handleAnswerChange(index, 'audio', item)}
                                            label="Vybrat audio odpovědi"
                                            onlyImage={false}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeAnswer(index)}
                                        disabled={answers.length <= 2}
                                        className="p-1 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-0 flex-shrink-0"
                                    >
                                        <RiCloseLine size={22} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addAnswer}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors text-left mt-2 font-medium"
                        >
                            <RiAddLine size={18} />
                            <span>Přidat odpověď</span>
                        </button>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !categoryName}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-4 rounded disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Ukládám...' : 'Uložit změny'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-2 bg-red-700 text-white border hover:bg-red-800 px-4 py-4 rounded transition-colors cursor-pointer"
                    >
                        <RiDeleteBinLine /> Smazat
                    </button>
                </div>
            </form>
        </div>
    )
}