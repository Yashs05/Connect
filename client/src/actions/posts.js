import axios from 'axios'
import socket from '../utils/socket'

export const loadPosts = () => async dispatch => {

    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/posts`)

        dispatch({
            type: 'posts/setPosts',
            payload: response.data
        })

    } catch (err) {
        dispatch({
            type: 'posts/setError',
            payload: true
        })
    }
}

export const loadPostsById = (id) => async dispatch => {

    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/posts/${id}`)

        dispatch({
            type: 'posts/setPosts',
            payload: response.data
        })

    } catch (err) {
        dispatch({
            type: 'posts/setError',
            payload: true
        })
    }
}

export const addPost = (formData, posts, setNewPost, setNewPostLoading, imageRef) => async dispatch => {

    try {
        const response = await axios.post(`${process.env.REACT_APP_END_POINT}/api/posts`, formData)

        dispatch({
            type: 'posts/setPosts',
            payload: [response.data, ...posts]
        })

        setNewPost({
            text: '',
            image: null
        })
        imageRef.current.value = null
        setNewPostLoading(false)

        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: 'Post added successfully.',
                success: true
            }
        })

        socket.emit('addPost', response.data)

    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })

        setNewPost({
            text: '',
            image: null
        })
        document.getElementsByClassName('post-file-input').target.value = null
        setNewPostLoading(false)
    }
}

export const deletePost = (id, posts, setPostDeleteLoading) => async dispatch => {

    try {
        const response = await axios.delete(`${process.env.REACT_APP_END_POINT}/api/posts/deletepost/${id}`)

        dispatch({
            type: 'posts/setPosts',
            payload: posts.filter(post => post._id !== id)
        })

        setPostDeleteLoading('')

        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: response.data.msg,
                success: true
            }
        })
        socket.emit('deletePost', id)

    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const likePost = (id, posts) => async dispatch => {

    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/posts/likepost/${id}`)

        dispatch({
            type: 'posts/setPosts',
            payload: posts.map(post => post._id === id ? { ...post, likes: response.data } : post)
        })

        socket.emit('likePost', { likes: response.data, postId: id })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const unlikePost = (id, posts) => async dispatch => {

    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/posts/unlikepost/${id}`)

        dispatch({
            type: 'posts/setPosts',
            payload: posts.map(post => post._id === id ? { ...post, likes: response.data } : post)
        })

        socket.emit('unlikePost', { likes: response.data, postId: id })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const addComment = (id, formData, posts, setCommentValue) => async dispatch => {

    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/posts/addcomment/${id}`, formData)

        dispatch({
            type: 'posts/setPosts',
            payload: posts.map(post => post._id === id ? { ...post, comments: response.data } : post)
        })

        setCommentValue('')
        socket.emit('addComment', { comments: response.data, postId: id })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}

export const deleteComment = (post_id, comment_id, posts) => async dispatch => {

    try {
        const response = await axios.put(`${process.env.REACT_APP_END_POINT}/api/posts/deletecomment/${post_id}/${comment_id}`)

        dispatch({
            type: 'posts/setPosts',
            payload: posts.map(post => post._id === post_id ? { ...post, comments: response.data } : post)
        })

        socket.emit('deleteComment', { comments: response.data, postId: post_id })
    } catch (err) {
        dispatch({
            type: 'alert/showAlert',
            payload: {
                msg: err.response.data.msg,
                success: false
            }
        })
    }
}