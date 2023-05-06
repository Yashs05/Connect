import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadProfile } from '../actions/profile'
import Navbar from '../Components/Navbar/Navbar'
import Profile from '../Components/Profile/Profile'
import { Link, useParams } from 'react-router-dom'
import Error from '../Components/Error'
import Spinner from '../Components/Loader/Spinner'
import Modal from '../Components/Modal/Modal'
import ProfileForm from '../Components/ProfileForm/ProfileForm'
import { Helmet } from 'react-helmet'

const ProfilePage = () => {

    const { id } = useParams();

    const dispatch = useDispatch()

    const { isAuthenticated, user } = useSelector(state => state.auth)
    const { profile, loading, error } = useSelector(state => state.profile)

    const { connections } = useSelector(state => state.connections)

    const [context, setContext] = useState('')

    const [update, setUpdate] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(loadProfile(id))
        }

        return () => {
            dispatch({
                type: 'profile/setDefault'
            })
        }
    }, [dispatch, isAuthenticated, id])

    if (error) return <Error />

    return (
        <>
            <Helmet>
                <title>{`Connect | ${profile ? profile.user.name : 'Profile'} `}</title>
            </Helmet>

            <Navbar />
            {loading ?
                <Spinner /> :
                <>
                    {profile ?
                        update ? <ProfileForm setUpdate={setUpdate} /> :
                            <>
                                <Profile setContext={setContext} setUpdate={setUpdate} id={id} connections={connections} />
                                <Modal context={context} />
                            </> :
                        user._id === id ?
                            <ProfileForm /> :
                            <main className='d-flex flex-column align-items-center my-5'>
                                <h3 className='color-main'>No Profile found</h3>
                                <div className='mb-3'>The profile you requested does not exist.</div>
                                <Link to='/' className='btn btn-outline-primary'>
                                    <i className="fa-solid fa-arrow-left me-2"></i>
                                    <span>Go to home</span>
                                </Link>
                            </main>
                    }
                </>
            }
        </>
    )
}

export default ProfilePage