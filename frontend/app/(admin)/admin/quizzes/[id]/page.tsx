import QuizDetail from '@/components/admin/quiz/QuizDetail'

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolved = await params

    return(
        <>  
            <QuizDetail id={Number(resolved.id)} />
        </>
    )
}