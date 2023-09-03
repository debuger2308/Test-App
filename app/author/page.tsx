
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import "./author.css"
import AuthorFeed from '@/component/AuthorFeed/AuthorFeed'



const Author = async () => {

    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    return (
        <div className="container">
            <div className="main__author">
                {!session && <h2 className='author__title'>To view your posts, please login to your account.</h2>}
                {session?.user.user_metadata.type === "Commentator"  && <h2 className='author__title'>To comment, go to the General feed and follow the link by clicking on the post</h2>}
                <AuthorFeed session={session} />
            </div>
        </div>
    );
}

export default Author;