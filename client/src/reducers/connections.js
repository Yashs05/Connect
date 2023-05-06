import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'connections',
    initialState: {
        connections: null,
        otherConnections: null,
        loading: true,
        error: false,
        otherConnectionsLoading: true,
        otherConnectionsError: false
    },
    reducers: {
        setConnections(state, action) {
            return {
                ...state,
                connections: action.payload,
                loading: false,
                error: false
            }
        },
        setOtherConnections(state, action) {
            return {
                ...state,
                otherConnections: action.payload,
                otherConnectionsLoading: false,
                otherConnectionsError: false
            }
        },
        setLoading(state, action) {
            return {
                ...state,
                loading: action.payload
            }
        },
        setError(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        setOtherConnectionsError(state, action) {
            return {
                ...state,
                otherConnectionsLoading: false,
                otherConnectionsError: action.payload
            }
        },
        removeConnections(state) {
            return {
                ...state,
                connections: null,
                otherConnections: null,
                loading: false,
                error: false,
                otherConnectionsLoading: true,
                otherConnectionsError: false
            }
        },
        setOtherConnectionsDefault(state) {
            return {
                ...state,
                otherConnections: null,
                otherConnectionsLoading: true,
                otherConnectionsError: false
            }
        }
    }
}

export const connectionsSlice = createSlice(options)