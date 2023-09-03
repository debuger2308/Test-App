"use client"
import type { Session } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import "./authorfeed.css"
import Link from 'next/link'


type Post = {
    creator: string,
    posttext: string,
    comments: string[]
    id: number
}


const AuthorFeed = ({ session }: { session: Session | null }) => {

    function filterPosts(searchTerm: string, listItems: Post[]) {
        return listItems.filter((post: Post) => post.creator?.toLocaleLowerCase()?.includes(searchTerm?.toLocaleLowerCase()))
    }

    const supabase = createClientComponentClient()
    const [posts, setPosts] = useState<Array<Post>>([])

    useEffect(() => {
        const getData = async () => {
            let { data: Posts, error } = await supabase
                .from('Posts')
                .select('*')
            setPosts(Posts?.sort((a, b) => b.id - a.id) || [])
        }
        getData()
    }, [])
    console.log(posts);

    return (
        <div className="author">
            {filterPosts(session?.user.user_metadata.nickname, posts).length === 0
                && <h3 className="author__item-title">You have no posts</h3>}
            {filterPosts(session?.user.user_metadata.nickname, posts)?.map((item: Post) => {
                return (
                    <Link href={`/general/${item.id}`} key={item.id} className="author__item">
                        <h3 className="author__item-title">Author: <span className="title-span">{item.creator}</span></h3>
                        <p className="author__comments">
                            comments: {
                                item.comments ? item.comments?.length : 0
                            }
                        </p>
                        <p className="author__item-p">{item.posttext}</p>
                    </Link>)

            })}

        </div>
    );
}

export default AuthorFeed;