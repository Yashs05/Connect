import { createSlice } from "@reduxjs/toolkit"

const options = {
    name: 'alert',
    initialState: {
        display: false,
        msg: '',
        success: null
    },
    reducers: {
        showAlert(state, action) {
            return {
                ...state,
                ...action.payload,
                display: true
            }
        },
        hideAlert() {
            return {
                display: false,
                msg: '',
                success: null
            }
        }
    }
}

export const alertSlice = createSlice(options)