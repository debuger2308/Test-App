
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


import GeneralFeed from '@/component/GeneralFeed/GeneralFeed';

import "./general.css"





const General = async () => {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    


    return (
        <div className="container">
            <div className="main__general">
                <h1 className="general__title">All posts</h1>
                <GeneralFeed session={session} />
            </div>
        </div>
    );
}

export default General;