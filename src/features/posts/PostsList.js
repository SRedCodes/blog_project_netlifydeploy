import { useSelector } from "react-redux";
import React from 'react'
import { selectAllPosts, getPostsStatus, getPostsError } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";


const PostsList = () => {
    const posts = useSelector(selectAllPosts)
    const postStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)


    let content;
    if(postStatus === "pending"){
        content = <p>"Loading..."</p>
    }else if(postStatus === "succeeded"){
        const orderedPosts = posts.slice().sort((a,b)=> b.date.localeCompare(a.date))
        /* localecompare is used for comparing string values.basically localecompare is like "- operator"" for integers (a,b) => a-b is as same as (a,b) => a.localecompare(b).. return -ve is a comes before b & vice versa */
        content = orderedPosts.map(post => <PostsExcerpt  key={post.id} post={post} />)
    }else if(postStatus ==='failed'){
        content = <p>{error}</p>
    }
    return (
        <section>
            {content}
        </section>
    )
}

export default PostsList