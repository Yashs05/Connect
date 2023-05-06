import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadProfiles } from '../../actions/people'
import Spinner from '../Loader/Spinner'
import connectBtn from '../../utils/connectBtn'
import { acceptConnectionRequest, cancelConnectionRequest, declineConnectionRequest, removeConnection, sendConnectionRequest } from '../../actions/connections'

const People = () => {

    const dispatch = useDispatch()

    const { isAuthenticated, user } = useSelector(state => state.auth)

    const { connections } = useSelector(state => state.connections)

    const { peopleList, loading, error } = useSelector(state => state.people)

    const [value, setValue] = useState('')

    const handleChange = (event) => {
        event.preventDefault()
        setValue(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch({
            type: 'people/setLoading',
            payload: true
        })

        dispatch(loadProfiles(value))
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <main style={{ padding: '0 20rem' }} className='my-5 people-container'>
            <form className="d-flex mb-4 input-group people-form" role="search" onSubmit={handleSubmit}>
                <input className="form-control px-3 py-3" type="search" value={value} placeholder="Search for people" aria-label="Search" onChange={handleChange} />
                <button className="btn btn-primary px-4" type="submit">
                    <span className='me-2 people-search-span'>Search</span>
                    <i className="fa-solid fa-magnifying-glass fa-sm"></i>
                </button>
            </form>

            {loading ?
                <Spinner /> :
                <>
                    <h5 className='fw-400 people-heading'>{peopleList.length ? `Showing ${peopleList.length.toLocaleString()} results` : 'No profiles found'}</h5>

                    {peopleList.length ?
                        <ul className='bg-white border-radius-10 list-unstyled people-ul'>
                            {peopleList.map((profile, i) => (
                                <li key={i} className='d-flex align-items-center px-4 people-list-item'>
                                    <Link to={`/${profile.user._id}`}>
                                        <img src={profile.user.profilePicture} alt={profile.user.name} width={60} height={60} className='rounded-circle me-4 people-image' />
                                    </Link>

                                    <div className={`d-flex align-items-center flex-grow-1 ${i === peopleList.length - 1 ? '' : 'border-bottom'}`}>
                                        <Link to={`/${profile.user._id}`} className='py-4 text-decoration-none flex-grow-1 people-link'>
                                            <div>
                                                <h5 className='mb-0'>{profile.user.name}</h5>
                                                <span>{profile.headline}</span>
                                            </div>

                                            <div className='text-secondary mt-2'>
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                <span className='fs-medium'>{profile.location}</span>
                                            </div>

                                            <div className='text-secondary'>
                                                <i className="fa-solid fa-user-tie me-1"></i>
                                                <span className='fs-medium'>{profile.status}</span>
                                            </div>
                                        </Link>
                                        {isAuthenticated && profile.user._id !== user._id ? connectBtn(dispatch, connections, profile.user._id, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection) : null}
                                    </div>
                                </li>
                            ))}
                        </ul> : null
                    }
                </>
            }
        </main>
    )
}

export default People