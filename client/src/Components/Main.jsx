import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

// Pages
import HomePage from "../Pages/HomePage";
import RegisterPage from "../Pages/RegisterPage";
import LoginPage from "../Pages/LoginPage";
import ProfilePage from "../Pages/ProfilePage";
import PeoplePage from '../Pages/PeoplePage'
import ProtectedRoute from './ProtectedRoute';
import AccountPage from '../Pages/AccountPage';
import AccountDeletePage from '../Pages/AccountDeletePage';

import { loadUser } from '../actions/auth';
import Navbar from './Navbar/Navbar';
import Posts from './Posts/Posts';
import ConnectionsPage from '../Pages/ConnectionsPage';
import socket from '../utils/socket';

const Main = () => {

  const dispatch = useDispatch()

  const { posts } = useSelector(state => state.posts)

  const location = useLocation()

  const currentPath = location.pathname.split('/')[1]

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    socket.on('connectionEmit', data => {
      dispatch({
        type: 'connections/setConnections',
        payload: data
      })
    })

    socket.on('profileEmitted', profileEmitted => {
      console.log(currentPath, profileEmitted.user._id)
      if (currentPath === profileEmitted.user._id) {
        dispatch({
          type: 'profile/setProfile',
          payload: profileEmitted
        })
      }
    })

    socket.on('profileDeleted', userId => {
      if (userId === currentPath) {
        dispatch({
          type: 'profile/removeProfile'
        })
      }
    })

    socket.on('postAdded', post => {
      dispatch({
        type: 'posts/setNewPosts',
        payload: post
      })
    })

    socket.on('postDeleted', id => {
      dispatch({
        type: 'posts/setPosts',
        payload: posts.filter(post => post._id !== id)
      })
    })

    socket.on('postLiked', data => {
      dispatch({
        type: 'posts/setPosts',
        payload: posts.map(post => post._id === data.postId ? { ...post, likes: data.likes } : post)
      })
    })

    socket.on('postUnliked', data => {
      dispatch({
        type: 'posts/setPosts',
        payload: posts.map(post => post._id === data.postId ? { ...post, likes: data.likes } : post)
      })
    })

    socket.on('commentAdded', data => {
      dispatch({
        type: 'posts/setPosts',
        payload: posts.map(post => post._id === data.postId ? { ...post, comments: data.comments } : post)
      })
    })

    socket.on('commentDeleted', data => {
      dispatch({
        type: 'posts/setPosts',
        payload: posts.map(post => post._id === data.postId ? { ...post, comments: data.comments } : post)
      })
    })
  }
  )

  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/register" element={<RegisterPage />} />
      <Route exact path="/login" element={<LoginPage />} />

      <Route exact path="/account" element={
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      } />
      <Route exact path="/deleteaccount" element={
        <ProtectedRoute>
          <AccountDeletePage />
        </ProtectedRoute>
      } />
      <Route exact path='/:id' element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route exact path='/:id/posts' element={
        <ProtectedRoute>
          <Navbar />
          <Posts />
        </ProtectedRoute>
      } />
      <Route exact path='/:id/connections' element={
        <ProtectedRoute>
          <ConnectionsPage />
        </ProtectedRoute>
      } />
      <Route exact path="/people" element={<PeoplePage />} />
      <Route path='*' element={
        <main className='d-flex flex-column align-items-center my-5'>
          <h3 className='color-main'>Page not found</h3>
        </main>
      } />
    </Routes>
  )
}

export default Main