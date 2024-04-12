import { createSlice, createAsyncThunk}from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
import {createSelector} from "reselect";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
    posts:[],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=>{
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async(initialState)=>{
    const response = await axios.post(POSTS_URL,initialState)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const {id} = initialPost;
    try{
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

const postSlice = createSlice({
    name: 'posts',
    initialState: initialState,
    reducers : {
        // postAdded:{

        //     reducer(state , action) {
        //         state.posts.push(action.payload)
        //     },
        //     prepare(title,content,userId) {
        //         return {
        //             payload:  {
        //                 id:nanoid(),
        //                 userId,
        //                 title,
        //                 date: new Date().toISOString(),
        //                 content,
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     wow: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     coffee: 0
        //                 }
        //                 }
        //             }
        //     }
        // },
        reactionAdded(state,action){
            const {postId, reaction} = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if(existingPost){
                existingPost.reactions[reaction]++
                
                /* Below is a Dynamic property access using bracket notation - this is a way to access or manipulate properties of an object in JavaScript when the property name is not known until runtime. It allows you to use a variable or an expression to specify the property name dynamically
                obj = {
                    name : john,
                    age : 35
                }
                const propName = 'name';
                const output = obj[propName] --> o/p : john                
                */
            }

        },
        increaseCount(state,action){
            state.count = state.count + 1
        }
    },
    extraReducers(builder){
        builder
        .addCase(fetchPosts.pending,(state,action) => {
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled,(state,action) => {
            state.status ='succeeded'
            let min = 1;
            const loadedPosts = action.payload.map(post => {
                post.date = sub(new Date(), {minutes : min ++}).toISOString();
                post.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                return post
            });
            state.posts = loadedPosts
        })
        .addCase(fetchPosts.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(addNewPost.fulfilled,(state,action)=>{
            action.payload.date = new Date().toISOString()
            action.payload.userId = Number(action.payload.userId)
            action.payload.reactions ={
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0
            }
            state.posts.push(action.payload)
        })
        .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload];
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts;
            })
    }

})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count


export const selectPostById = (state, postId) =>
    state.posts.posts.find(post => post.id === postId)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)

export const {increaseCount, reactionAdded} = postSlice.actions
export default postSlice.reducer