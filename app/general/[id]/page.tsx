
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import "./post.css"
import Comments from '@/component/Comments/Comments'
type Props = {
    params: {
        id: string
    }
}
type Post = {
    creator: string,
    posttext: string,
    id: number,
    comments: string[]
}

const Post = async ({ params: { id } }: Props) => {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()




    let { data: GetPost, error } = await supabase
        .from('Posts')
        .select('*')
        .eq('id', id)
    let Post: Post | null = null
    if (!error) {
        if (GetPost?.length !== 0 && GetPost) Post = GetPost[0]
    }

    return (
        <div className="container">
            <div className="main__post">
            <h1 className='post__title'>Author: <span className="title-span">{Post?.creator}</span></h1>
            <p className="post__text">{Post?.posttext}</p>
            <ul className="post__comments-list">
                <div className="post__comment-title">Comments:</div>
                <Comments session={session} id={id} />
            </ul>
        </div>
        </div>
    );
}

export default Post;