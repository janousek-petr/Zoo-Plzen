import RootRedirect from "@/components/guard/RootRedirect";
import StartPage from "@/components/ui/StartPage"; // uprav cestu dle svého projektu

export default function RootPage() {
    return (
        <RootRedirect>
            <StartPage />
        </RootRedirect>
    );
}