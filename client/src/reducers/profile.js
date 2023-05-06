import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'profile',
    initialState: {
        profile: null,
        loading: true,
        error: false
    },
    reducers: {
        setProfile(state, action) {
            return {
                profile: action.payload,
                loading: false,
                error: false
            }
        },
        removeProfile(state) {
            return {
                ...state,
                profile: null
            }
        },
        setError(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        },
        setLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            }
        },
        setDefault() {
            return {
                profile: null,
                loading: true,
                error: false
            }
        }
    }
}

export const profileSlice = createSlice(options)