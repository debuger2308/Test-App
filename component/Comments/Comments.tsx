"use client"
import { useEffect, useState } from "react"
import "./comments.css"
import type { Session } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


type Props = {
    session: Session | null,
    id: string
}
type Comment = {
    nickname: string,
    text: string
}

const Comments = ({ session, id }: Props) => {
    const supabase = createClientComponentClient()
    const [inputText, setInputText] = useState('')


    const [comments, setComents] = useState<Array<Comment>>([])

    useEffect(() => {
        const getData = async () => {
            let { data: GetPost, error } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
            setComents(GetPost?.[0]?.comments || [])
        }
        getData()
    }, [])

    return (
        <div className="post__comments">
            {session?.user.user_metadata.type === "Commentator"
                && <>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.currentTarget.value)
                        }}
                        placeholder="New Comment" className='post__comment-input' />

                    <button
                        onClick={async () => {
                            const { data, error } = await supabase
                                .from('Posts')
                                .update({ comments: [{ nickname: session?.user.user_metadata.nickname, text: inputText }, ...comments] })
                                .eq('id', id)
                                .select()
                            const getData = async () => {
                                let { data: GetPost, error } = await supabase
                                    .from('Posts')
                                    .select('*')
                                    .eq('id', id)
                                setComents(GetPost?.[0]?.comments || [])
                            }
                            getData()
                        }}
                        className="post__comment-submit">Submit</button>
                </>
            }

            {comments?.map((item, id) => {
                return <li key={id} className='post__comment'><span className="title-span">{item.nickname}: </span>{item.text}</li>
            })}
        </div>
    );
}

export default Comments