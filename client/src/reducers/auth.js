import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        error: false,
        user: null
    },
    reducers: {
        setToken(state, action) {
            localStorage.setItem('token', action.payload)
            return {
                ...state,
                token: action.payload,
                isAuthenticated: true
            }
        },
        setError(state, action) {
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            }
        },
        setLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            }
        },
        setUser(state, action) {
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
                error: false
            }
        },
        removeUser(state) {
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        }
    }
}

export const authSlice = createSlice(options)