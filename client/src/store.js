import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './reducers/auth'
import { alertSlice } from './reducers/alert'
import { profileSlice } from './reducers/profile'
import { peopleSlice } from './reducers/people'
import { postSlice } from './reducers/posts'
import { connectionsSlice } from './reducers/connections'
import thunk from 'redux-thunk'

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        alert: alertSlice.reducer,
        profile: profileSlice.reducer,
        people: peopleSlice.reducer,
        posts: postSlice.reducer,
        connections: connectionsSlice.reducer
    },

    middleware: [thunk]
})

export default store