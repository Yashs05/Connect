import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'people',
    initialState: {
        peopleList: [],
        loading: true,
        error: false
    },
    reducers: {
        setList(state, action) {
            return {
                ...state,
                peopleList: action.payload,
                loading: false
            }
        },
        setLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            }
        },
        setErr(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        setDefault(state, action) {
            return {
                ...state,
                peopleList: action.payload,
                loading: true,
                error: false
            }
        }
    }
}

export const peopleSlice = createSlice(options)