"use client"
import "./signoutbtn.css"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const SignOutBtn = () => {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <button className="signout-btn account__btn" onClick={handleSignOut}>
            Sign Out
        </button>
    );
}

export default SignOutBtn;