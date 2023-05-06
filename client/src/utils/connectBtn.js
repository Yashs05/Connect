const connectBtn = (dispatch, connections, userId, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection) => {

    return (
        !connections || (!connections.connections.find(conn => conn.user === userId) && !connections.requestsSent.find(req => req.user === userId) && !connections.requestsReceived.find(req => req.user === userId)) ?
            <button className='d-flex align-items-center color-main border-main bg-white bg-hover-main px-3 py-1 border-radius-20 fs-medium' onClick={() => dispatch(sendConnectionRequest(userId))}>
                <i className='fa-solid fa-plus fa-sm me-2'></i>
                <span className='fs-medium'>Connect</span>
            </button> :
            connections.requestsSent.find(req => req.user === userId) ?
                <button className='d-flex align-items-center text-secondary border border-secondary bg-white bg-hover-main px-3 py-1 border-radius-20 fs-medium' onClick={() => dispatch(cancelConnectionRequest(userId))}>
                    <i className='fa-solid fa-clock-rotate-left fa-sm me-2'></i>
                    <span className='fs-medium'>Request sent</span>
                </button> :
                connections.requestsReceived.find(req => req.user === userId) ?
                    <div className='d-flex'>
                        <button className='d-flex justify-content-center align-items-center color-main border-main bg-white bg-hover-main px-3 py-1 border-radius-20 fs-medium accept-request-btn' onClick={() => dispatch(acceptConnectionRequest(userId))}>
                            <i className='fa-solid fa-check fa-sm me-2 accept-request-icon'></i>
                            <span className='fs-medium request-accept-span'>Accept request</span>
                        </button>
                        <button className='d-flex align-items-center btn-default-revert text-secondary px-3' onClick={() => dispatch(declineConnectionRequest(userId))}>
                            <span className='fs-medium request-reject-span'>Decline</span>
                            <i className='fa-solid fa-xmark fa-sm me-2 reject-request-icon d-none'></i>
                        </button>
                    </div> :
                    <button className='d-flex align-items-center text-danger border border-danger bg-white bg-hover-danger px-3 py-1 border-radius-20 fs-medium' onClick={() => dispatch(removeConnection(userId))}>Disconnect</button>
    )
}

export default connectBtn