
import "./account.css"
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SignOutBtn from "@/component/SignOutBtn/page"
import { redirect } from 'next/navigation'

const Account = async () => {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    return (
        <div className="container">
            <main className="account">
            <p className="account__info-text">Nickname: {session?.user.user_metadata.nickname}</p>
            <p className="account__info-text">Profile type: {session?.user.user_metadata.type}</p>
            <p className="account__info-text">Email: {session?.user.email}</p>
            <SignOutBtn />
        </main>
        </div>
    );
}

export default Account;