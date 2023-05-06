import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Spinner from '../Loader/Spinner'
import { loadPosts, addPost, deletePost, addComment, deleteComment, likePost, unlikePost, loadPostsById } from '../../actions/posts'
import { Link, useLocation, useParams } from 'react-router-dom'
import { acceptConnectionRequest, cancelConnectionRequest, declineConnectionRequest, removeConnection, sendConnectionRequest } from '../../actions/connections'
import connectBtn from '../../utils/connectBtn'
import { Helmet } from 'react-helmet'

const Posts = () => {

    const dispatch = useDispatch()

    const location = useLocation()

    const { id } = useParams();

    const { user } = useSelector(state => state.auth)

    const { posts, loading, error, newPosts } = useSelector(state => state.posts)

    const { connections } = useSelector(state => state.connections)

    const [newPost, setNewPost] = useState({
        text: '',
        image: null
    })

    const imageRef = useRef()

    const [newPostLoading, setNewPostLoading] = useState(false)
    const [postDeleteLoading, setPostDeleteLoading] = useState('')

    const [commentValue, setCommentValue] = useState('')

    const [likeCommentsOpen, setLikeCommentsOpen] = useState({
        postId: '',
        context: ''
    })

    const [deleteAlert, setDeleteAlert] = useState(null)

    const createPost = e => {
        e.preventDefault()

        if (!newPost.text.trim() && !newPost.image) return;

        setNewPostLoading(true)
        const formData = new FormData()
        formData.append('text', newPost.text)
        formData.append('image', newPost.image)

        dispatch(addPost(formData, posts, setNewPost, setNewPostLoading, imageRef))
    }

    const handlePostDelete = id => {
        setDeleteAlert(null)
        setPostDeleteLoading(id)
        dispatch(deletePost(id, posts, setPostDeleteLoading))
    }

    const handleLikeClick = id => {

        if (posts.find(post => post._id === id).likes.filter(like => like.user === user._id).length) {
            dispatch(unlikePost(id, posts))
        }
        else {
            dispatch(likePost(id, posts))
        }
    }

    const handleCommentAdd = (e, id) => {
        e.preventDefault()

        if (!commentValue.trim()) return;

        const formData = new FormData()
        formData.append('text', commentValue)

        dispatch(addComment(id, formData, posts, setCommentValue))
    }

    const handleCommentDelete = (post_id, comment_id) => {
        dispatch(deleteComment(post_id, comment_id, posts))
    }

    const addNewPosts = () => {
        dispatch({
            type: 'posts/setPosts',
            payload: newPosts.concat(posts)
        })

        dispatch({
            type: 'posts/setNewPostsDefault',
            payload: []
        })
    }

    useEffect(() => {
        if (location.pathname === '/') {
            dispatch(loadPosts())
        }
        else {
            dispatch(loadPostsById(id))
        }

        return () => {
            dispatch({
                type: 'posts/setDefault'
            })
        }
    }, [dispatch, id, location])

    if (error) return (
        <main className='d-flex flex-column align-items-center my-5'>
            <h3 className='color-main'>Something went wrong</h3>
            <div className='mb-3'>Either this page does not exist or we might be having some issues.</div>
        </main>
    )

    if (loading) return <Spinner />

    return (
        <>
            <Helmet>
                <title>Connect | Posts</title>
            </Helmet>

            <main style={{ padding: '0 25rem' }} className='post-container'>

                {location.pathname === '/' ?
                    <form className="py-4 border-bottom post-form" onSubmit={createPost}>
                        <input type="text" value={newPost.text} className="form-control px-3 py-3 mb-1" placeholder="Write something to post" onChange={e => setNewPost({ ...newPost, text: e.target.value })} />
                        <div className='d-flex post-inputs'>
                            <div className="input-group">
                                <input type="file" ref={imageRef} className="form-control me-4 post-file-input" id='post-file-input' aria-label="Upload" onChange={e => setNewPost({ ...newPost, image: e.target.files[0] })} />
                            </div>
                            <button className="btn btn-primary px-5 border-radius-20" type="submit" disabled={(!newPost.text.trim() && !newPost.image) || newPostLoading ? true : false}>
                                {newPostLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Post'}
                            </button>
                        </div>
                    </form> : <h4 className='my-4 fw-400 posts-heading'>{id === user._id ? 'Your posts' : posts.length ? `${posts[0].name}'s posts` : 'This user has not posted anything'}</h4>
                }

                {posts.length ?
                    <div className='position-relative'>

                        {location.pathname === '/' && newPosts.length ?
                            <button className="position-sticky btn btn-primary px-4 border-radius-20 fw-400" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)' }} onClick={addNewPosts}>
                                <i className="fa-solid fa-rotate-right fa-small me-2"></i>
                                <span>New posts</span>
                            </button> : null}

                        {posts.map((post, i) => {
                            return (
                                <section key={i} className={`${i !== posts.length - 1 ? 'mb-3' : null} bg-white px-4 my-4 border-radius-10 border post-items`}>

                                    <div className='border-bottom pt-4 pb-3 post-top-item'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <Link to={`/${post.user}`} className='d-flex align-items-center text-decoration-none'>
                                                <img src={post.profilePicture} alt={post.name} className='rounded-circle me-3 post-user-image' width={50} height={50} />
                                                <h5 className='mb-0 flex-grow-1'>{post.name}</h5>
                                            </Link>

                                            {post.user === user._id ?
                                                <button className='btn-default-revert text-danger border border-danger bg-hover-danger px-3 py-1 border-radius-20 fs-medium' onClick={() => setDeleteAlert(post._id)} disabled={postDeleteLoading ? true : false}>
                                                    {postDeleteLoading === post._id ? <span className="spinner-border spinner-border-sm mx-3" role="status" aria-hidden="true"></span> : 'Delete post'}
                                                </button> :

                                                connectBtn(dispatch, connections, post.user, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection)}
                                        </div>

                                        {deleteAlert === post._id ?
                                            <div className="d-flex justify-content-between align-items-center alert alert-danger confirm-alert mt-3 py-2" role="alert">
                                                <span>Are you sure you want to delete this post.</span>
                                                <div>
                                                    <button className="btn px-3 py-0 me-2 border-radius-5 fs-medium" onClick={() => setDeleteAlert(null)}>Cancel</button>
                                                    <button className="btn btn-danger px-3 py-0 border-radius-5 fs-medium" onClick={() => dispatch(handlePostDelete(post._id))}>Delete</button>
                                                </div>
                                            </div> : null}
                                    </div>

                                    <div className='py-3 border-bottom'>
                                        {post.text ?
                                            <div className='mb-3'>
                                                {post.text}
                                            </div> : null
                                        }

                                        {post.image ?
                                            <img src={post.image} alt='Unable to load.' className='border-radius-10 mb-3 post-image' width={'100%'} /> : null
                                        }

                                        <div className='d-flex justify-content-between fs-medium text-secondary'>
                                            <div className='d-flex'>
                                                {post.likes.length ?
                                                    <button className='btn-default-revert text-secondary text-decoration-hover me-3 likes-header' onClick={() => setLikeCommentsOpen({ postId: post._id, context: 'Likes' })}>{post.likes.length + ' ' + (post.likes.length === 1 ? 'like' : 'likes')}</button> :
                                                    <div className='me-3 likes-header'>No likes yet.</div>}

                                                {post.comments.length ?
                                                    <button className='btn-default-revert text-secondary text-decoration-hover me-3' onClick={() => setLikeCommentsOpen({ postId: post._id, context: 'Comments' })}>{post.comments.length + ' ' + (post.comments.length === 1 ? 'comment' : 'comments')}</button> :
                                                    <div>No Comments yet.</div>}
                                            </div>

                                            <div className='d-flex align-items-center text-secondary'>
                                                <i className="fa-regular fa-clock me-2"></i>
                                                <span className='fs-medium'>{moment(post.date).format("MMM Do, YYYY")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='py-3'>
                                        <div className={`d-flex align-items-center ${likeCommentsOpen.postId === post._id ? 'mb-3' : null}`}>
                                            <button className={`btn-default-revert ${post.likes.filter(like => like.user === user._id).length ? 'color-main' : null}`} onClick={() => handleLikeClick(post._id)}>
                                                <i className={`${post.likes.filter(like => like.user === user._id).length ? 'fa-solid' : 'fa-regular'} fa-thumbs-up fa-lg me-1`}></i>
                                                <span className='like-text'>{post.likes.filter(like => like.user === user._id).length ? 'Unlike' : 'Like'}</span>
                                            </button>
                                            <form className='d-flex flex-grow-1' onSubmit={e => handleCommentAdd(e, post._id)}>
                                                <input type="text" value={commentValue} className="form-control border-radius-20 border-input fs-medium px-3 py-2 mx-3 comment-input" placeholder="Add a comment" onChange={e => setCommentValue(e.target.value)} />
                                                <button className="btn btn-primary px-4 border-radius-20 add-post-btn" type="submit" disabled={commentValue.trim() ? false : true}>
                                                    <span className='comment-add-btn-span'>Add</span>
                                                    <i className='fa-solid fa-plus d-none add-post-icon'></i>
                                                </button>
                                            </form>
                                        </div>

                                        {likeCommentsOpen.postId === post._id ?
                                            <div>
                                                <h6>{likeCommentsOpen.context}</h6>
                                                <ul className='list-unstyled mb-0 bg-main px-3 like-comments-ul border-radius-10'>
                                                    {likeCommentsOpen.context === 'Likes' ? post.likes.map((like, i, arr) => {
                                                        return (
                                                            <li key={i}>
                                                                <Link to={`/${like.user}`} className='d-flex align-items-center text-decoration-none'>
                                                                    <img src={like.profilePicture} alt={like.name} className='rounded-circle me-3' width={40} height={40} />
                                                                    <h6 className={`mb-0 me-3 flex-grow-1 py-4 like-mobile ${i !== arr.length - 1 ? 'border-bottom' : null}`}>{like.name}</h6>
                                                                </Link>
                                                            </li>
                                                        )
                                                    }) :
                                                        post.comments.map((comment, i, arr) => {
                                                            return (
                                                                <li key={i} className='d-flex align-items-center'>
                                                                    <Link to={`/${comment.user}`}>
                                                                        <img src={comment.profilePicture} alt={comment.name} className='rounded-circle me-3' width={40} height={40} />
                                                                    </Link>
                                                                    <div className={`flex-grow-1 py-3 comment-mobile ${i !== arr.length - 1 ? 'border-bottom' : null}`}>
                                                                        <Link to={`/${comment.user}`} className='text-decoration-none'>
                                                                            <h6 className='mb-0 me-3'>{comment.name}</h6>
                                                                        </Link>
                                                                        <span className='fs-small'>{comment.text}</span>
                                                                    </div>
                                                                    {post.user === user._id || comment.user === user._id ?
                                                                        <button className='btn-default-revert' onClick={() => handleCommentDelete(post._id, comment._id)}><i className="fa-solid fa-trash-can text-secondary"></i></button> : null
                                                                    }
                                                                </li>
                                                            )
                                                        })}
                                                </ul>
                                            </div> : null}
                                    </div>
                                </section>
                            )
                        })
                        }
                    </div> : <div className='ms-3'>There are no posts available at the moment.</div>}
            </main>
        </>
    )
}

export default Posts