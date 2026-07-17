import ProfileSelection from "@/components/auth/ProfileSelection";
import RootRedirect from "@/components/guard/RootRedirect";

export default function SelectProfile(){
    return(
        <>
            <RootRedirect>
                <ProfileSelection/>
            </RootRedirect>
        </>
    )
}