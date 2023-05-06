import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { acceptConnectionRequest, cancelConnectionRequest, declineConnectionRequest, removeConnection, sendConnectionRequest } from '../../actions/connections'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import connectBtn from '../../utils/connectBtn'

const selectConnectionsState = state => state.connections.connections

const Connections = ({ connections, user, id }) => {

    const dispatch = useDispatch()

    const [context, setContext] = useState('connections')

    const userConnections = useSelector(selectConnectionsState)

    const [list, setList] = useState(connections?.connections)

    return (
        <main style={{ padding: '0 20rem' }} className='connections-container'>
            {connections ?
                <>
                    <h4 className='fw-400 my-4 connections-heading'>{connections.user === user._id ? 'Your connections' : `${connections.name}'s connections`}</h4>

                    {user._id === id ?
                        <ul className="d-flex justify-content-between list-unstyled border-radius-10 bg-white border connection-context">
                            <li className='col-md-4 text-center py-2 px-2'>
                                <button className={`btn-default-revert px-2 py-2 w-100 border-radius-10 ${context === 'connections' ? 'bg-color-main text-white' : 'bg-hover-main'}`} onClick={context !== 'connections' ? () => { setContext('connections'); setList(connections?.connections) } : null}>Connections</button>
                            </li>
                            <li className='col-md-4 text-center py-2 px-2'>
                                <button className={`btn-default-revert px-2 py-2 w-100 border-radius-10 ${context === 'received' ? 'bg-color-main text-white' : 'bg-hover-main'}`} onClick={context !== 'received' ? () => { setContext('received'); setList(connections?.requestsReceived) } : null}>
                                    <span className='position-relative px-1 py-2'>
                                        Requests received
                                        {connections.requestsReceived?.length ?
                                            <span className="position-absolute top-0 start-100 badge rounded-pill bg-danger fw-500">
                                                {connections.requestsReceived.length}
                                            </span> : null}
                                    </span>
                                </button>
                            </li>
                            <li className='col-md-4 text-center py-2 px-2'>
                                <button className={`btn-default-revert px-2 py-2 w-100 border-radius-10 ${context === 'sent' ? 'bg-color-main text-white' : 'bg-hover-main'}`} onClick={context !== 'sent' ? () => { setContext('sent'); setList(connections?.requestsSent) } : null}>Requests sent</button>
                            </li>
                        </ul> : null}

                    {context === 'connections' ?
                        connections.connections.length ?

                            <ul className='bg-white border-radius-10 list-unstyled connections-ul'>
                                {connections.connections.map((conc, i) => (
                                    <li key={i} className='d-flex align-items-center px-4 connections-item'>
                                        <Link to={`/${conc.user}`}>
                                            <img src={conc.profilePicture} alt={conc.name} width={60} height={60} className='rounded-circle me-4 connections-image' />
                                        </Link>

                                        <div className={`d-flex align-items-center flex-grow-1 ${i === list.length - 1 ? '' : 'border-bottom'}`}>
                                            <Link to={`/${conc.user}`} className='py-4 text-decoration-none flex-grow-1'>
                                                <h5 className='mb-0'>{conc.name}</h5>
                                                <small className='text-secondary'>{`Connected on ${moment(conc.date).format("MMM Do, YYYY")}`}</small>
                                            </Link>

                                            {user._id !== conc.user ? connectBtn(dispatch, userConnections, conc.user, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection) : null}
                                        </div>
                                    </li>
                                ))}
                            </ul> :
                            user._id === id ?
                                <>
                                    <div className='ms-3'>You do not have any connections. </div>
                                    <div className='ms-3'><Link to='/people' className='text-decoration-none color-main text-decoration-hover'>Find people</Link> to make connections.</div>
                                </> : <div className='d-flex flex-wrap justify-content-between align-items-center px-3 py-3 bg-white border-radius-10'>
                                    <span className='mb-1'>This user does not have any connections.</span>
                                    {connectBtn(dispatch, userConnections, id, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection)}
                                </div>
                        :
                        context === 'received' ?
                            connections.requestsReceived.length ?

                                <ul className='bg-white border-radius-10 list-unstyled'>
                                    {connections.requestsReceived.map((conc, i) => (
                                        <li key={i} className='d-flex align-items-center px-4 connections-item'>
                                            <Link to={`/${conc.user}`}>
                                                <img src={conc.profilePicture} alt={conc.name} width={60} height={60} className='rounded-circle me-4 connections-image' />
                                            </Link>

                                            <div className={`d-flex align-items-center flex-grow-1 ${i === list.length - 1 ? '' : 'border-bottom'}`}>
                                                <Link to={`/${conc.user}`} className='py-4 text-decoration-none flex-grow-1'>
                                                    <h5 className='mb-0'>{conc.name}</h5>
                                                    <small className='text-secondary'>{`Request received on ${moment(conc.date).format("MMM Do, YYYY")}`}</small>
                                                </Link>

                                                {user._id !== conc.user ? connectBtn(dispatch, userConnections, conc.user, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul> :
                                <>
                                    <div className='ms-3'>You do not have any pending request.</div>
                                </>
                            :
                            connections.requestsSent.length ?

                                <ul className='bg-white border-radius-10 list-unstyled'>
                                    {connections.requestsSent.map((conc, i) => (
                                        <li key={i} className='d-flex align-items-center px-4 connections-item'>
                                            <Link to={`/${conc.user}`}>
                                                <img src={conc.profilePicture} alt={conc.name} width={60} height={60} className='rounded-circle me-4 connections-image' />
                                            </Link>

                                            <div className={`d-flex align-items-center flex-grow-1 ${i === list.length - 1 ? '' : 'border-bottom'}`}>
                                                <Link to={`/${conc.user}`} className='py-4 text-decoration-none flex-grow-1'>
                                                    <h5 className='mb-0'>{conc.name}</h5>
                                                    <small className='text-secondary'>{`Request sent on ${moment(conc.date).format("MMM Do, YYYY")}`}</small>
                                                </Link>

                                                {user._id !== conc.user ? connectBtn(dispatch, userConnections, conc.user, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul> :
                                <>
                                    <div className='ms-3'>You do not have any pending request.</div>
                                </>
                    }
                </> : <div className='d-flex flex-wrap px-4 py-4 my-4 bg-white border-radius-10 mb-mobile'>
                    <h5 className='fw-400 mb-0 flex-grow-1'>{user._id === id ? 'You do not have any connections' : 'This user does not have any connections.'}</h5>
                    {user._id === id ? <h5><Link to='/people' className='text-decoration-none color-main text-decoration-hover'> Find people</Link>to make connections.</h5> :
                        connectBtn(dispatch, userConnections, id, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection)}
                </div>}
        </main>
    )
}

export default Connections