"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react";
import "./generalfeed.css"
import type { Session } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link';

type Post = {
    creator: string,
    posttext: string,
    comments: string[]
    id: number
}

const GeneralFeed = ({ session }: { session: Session | null }) => {
    const supabase = createClientComponentClient()
    const [inputText, setInputText] = useState('')


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

    return (
        <>
            {session?.user.user_metadata.type === "Author" &&
                <div className="general__newpost">
                    <div onInput={(e) => {
                        setInputText(e.currentTarget.textContent || '')
                    }}
                        contentEditable={true}
                        className="newpost__input"></div>

                    <button
                        onClick={async () => {
                            const { data, error } = await supabase
                                .from('Posts')
                                .insert([
                                    { creator: session?.user.user_metadata.nickname, posttext: inputText },
                                ])
                                .select()
                            if (error) console.log(error);
                            const getData = async () => {
                                let { data: Posts, error } = await supabase
                                    .from('Posts')
                                    .select('*')
                                setPosts(Posts?.sort((a, b) => b.id - a.id) || [])
                            }
                            getData()

                        }}
                        className="newpost__submit-btn">Add post</button>
                </div>
                }

            <ul className="general__list">
                {posts?.map((item: Post) => {
                    return (
                        <Link href={`/general/${item.id}`} key={item.id} className="general__item">
                            <h3 className="general__item-title">Author: <span className="title-span">{item.creator}</span></h3>
                            <p className="general__comments">
                                comments: {
                                    item.comments ? item.comments.length : 0
                                }
                            </p>
                            <p className="general__item-p">{item.posttext}</p>
                        </Link>)

                })}
            </ul>
        </>

    );
}

export default GeneralFeed;