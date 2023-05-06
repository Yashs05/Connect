import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadProfiles } from '../actions/people'
import Navbar from '../Components/Navbar/Navbar'
import People from '../Components/People/People'
import Error from '../Components/Error'
import { Helmet } from 'react-helmet'

const PeoplePage = () => {

    const dispatch = useDispatch()

    const { peopleList, loading, error } = useSelector(state => state.people)

    useEffect(() => {
        dispatch(loadProfiles())

        return () => {
            dispatch({
                type: 'people/setDefault',
                payload: []
            })
        }
    }, [dispatch])

    if (error) return <Error />

    return (
        <>
            <Helmet>
                <title>Connect | Find people</title>
            </Helmet>

            <Navbar />
            <People list={peopleList} loading={loading} />
        </>
    )
}

export default PeoplePage