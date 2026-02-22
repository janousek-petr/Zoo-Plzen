export default function AuthLayout({children} : {children : React.ReactNode}){
    return(
        <>
            <main className="md:my-30 my-20">
                {children}
            </main>
        </>
    )
}