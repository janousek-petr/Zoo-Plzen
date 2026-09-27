import Header from "@/components/admin/Header";
import AdminChallengesPage from "@/components/admin/challenges/AdminChallengesPage";

export default function AdminChallenges() {
    return (
        <>
            <Header title="Výzvy" href="/admin"/>

            <div className="p-6">
                <AdminChallengesPage/>
            </div>
        </>)

}