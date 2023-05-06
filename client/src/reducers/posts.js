import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'posts',
    initialState: {
        posts: [],
        newPosts: [],
        loading: true,
        error: false
    },
    reducers: {
        setPosts(state, action) {
            return {
                ...state,
                posts: action.payload,
                loading: false,
                error: false
            }
        },
        setNewPosts(state, action) {
            return {
                ...state,
                newPosts: state.newPosts.concat(action.payload),
            }
        },
        setNewPostsDefault(state) {
            return {
                ...state,
                newPosts: [],
            }
        },
        setError(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        setDefault() {
            return {
                posts: [],
                newPosts: [],
                loading: true,
                error: false
            }
        }
    }
}

export const postSlice = createSlice(options)