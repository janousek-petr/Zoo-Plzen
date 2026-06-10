export interface UserTabProps{
    "email" : string,
    "profiles" : number
}

export function UserTab({email, profiles} : UserTabProps){
    return(
        <>
            <div className="flex flex-row gap-5 p-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-400 duration-100 rounded-xl shadow-sm cursor-pointer">
                <span>{email}</span>
                <span>{profiles} profily</span>
            </div>
        </>
    )
}