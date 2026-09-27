import Header from "@/components/admin/Header";
import AddChallenge from "@/components/admin/challenges/AddChallenge";

export default function CreateChallengePage() {
    return (
        <>
            <Header title="Vytvoření výzev" href="/admin/challenges"/>

            <div className="p-6">
                <AddChallenge/>
            </div>
        </>
    );
}