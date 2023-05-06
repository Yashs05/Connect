import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteEducation, deleteExperience, deleteProfile } from '../../actions/profile'
import { Link } from 'react-router-dom'
import connectBtn from '../../utils/connectBtn'
import { acceptConnectionRequest, cancelConnectionRequest, declineConnectionRequest, removeConnection, sendConnectionRequest } from '../../actions/connections'

const Profile = ({ setContext, setUpdate, id, connections }) => {

  const dispatch = useDispatch()

  const { profile } = useSelector(state => state.profile)

  const { user } = useSelector(state => state.auth)

  const [expAlert, setExpAlert] = useState(null)

  const [eduAlert, setEduAlert] = useState(null)

  const [deleteAlert, setDeleteAlert] = useState(false)

  const handleProfileUpdate = () => {
    setUpdate(true)
  }

  const handleProfileDelete = () => {
    if (deleteAlert) {
      dispatch(deleteProfile(profile.user._id))
      setDeleteAlert(false)
    }
    else {
      setDeleteAlert(true)
    }
  }

  return (
    <>
      <main style={{ padding: '0 20rem' }} className='my-5 profile-container'>
        <div className='bg-white border-radius-10 px-4 py-4 profile-card'>
          <section className='d-flex justify-content-between align-items-center border-bottom pb-4 profile-top-section'>
            <img src={profile.user.profilePicture} alt="" className='rounded-circle mb-2' width={150} />

            <div className='d-flex flex-column align-items-end profile-top-bio'>
              <h3 className='mb-0'>{profile.user.name}</h3>
              <div className='text-secondary mb-3'>{profile.status}</div>
              <div className='mb-3'>{profile.headline}</div>

              {user._id === profile.user._id ?
                <button type="button" className="px-4 py-1 color-main border-radius-20 border-main bg-white bg-hover-main" onClick={handleProfileUpdate}>Edit profile</button> :
                connectBtn(dispatch, connections, profile.user._id, sendConnectionRequest, cancelConnectionRequest, acceptConnectionRequest, declineConnectionRequest, removeConnection)
              }
            </div>
          </section>

          <section className='py-4 border-bottom'>
            <h4 className='fw-400'>About</h4>

            <div>
              <p className='mb-4'>{profile.bio || `${user._id === profile.user._id ? 'You have' : `${profile.user.name} has`} not added any bio.`}</p>

              <div className='mb-4'>
                <div className='d-flex align-items-center text-secondary mb-1'>
                  <i className="fa-solid fa-calendar-week me-2"></i>
                  <span className='fs-medium'>{`Joined on ${new Date(profile.user.date).toLocaleDateString()}`}</span>
                </div>

                <div className='d-flex align-items-center text-secondary mb-1'>
                  <i className="fa-solid fa-location-dot me-2"></i>
                  <span className='fs-medium'>{profile.location}</span>
                </div>

                <div className='d-flex align-items-center text-secondary'>
                  <i className="fa-solid fa-briefcase me-2"></i>
                  <span className='fs-medium'>{profile.company || null}</span>
                </div>
              </div>

              <div className='fs-medium mb-4'>
                <i className="fa-solid fa-envelope me-2 text-secondary"></i>
                <span className='text-secondary'>Contact info : </span>
                <span>{profile.user.email}</span>
              </div>

              <div className='d-flex flex-column'>
                <Link to={`/${id}/connections`} className='text-primary text-decoration-none text-decoration-hover' style={{ width: 'fit-content' }}>View connections</Link>
                <Link to={`/${id}/posts`} className=' text-primary text-decoration-none text-decoration-hover' style={{ width: 'fit-content' }}>View posts</Link>
              </div>
            </div>
          </section>

          <section className='py-4 border-bottom'>
            <h4 className='fw-400'>Skills</h4>
            <ul className='list-unstyled d-flex flex-wrap mb-0'>
              {profile.skills.length ?
                profile.skills.map((skill, i) => {
                  return <li key={i} className='fs-medium bg-main px-3 py-1 mx-2 my-2 border-radius-10 border border-primary'>
                    {skill}
                  </li>
                }) : <span>{`${user._id === profile.user._id ? 'You have' : `${profile.user.name} has`} not added any skills.`}</span>}
            </ul>
          </section>

          <section className='py-4 border-bottom'>
            <div className='d-flex'>
              <h4 className='fw-400 flex-grow-1'>Experience</h4>
              {user._id === profile.user._id ?
                <button className='d-flex align-items-center btn bg-main color-main bg-hover-main rounded-circle profile-add-btn' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setContext('experience')}>
                  <i className="fa-solid fa-plus"></i>
                </button> : null
              }
            </div>
            {profile.experience.length ?
              <ul className='list-unstyled mb-0'>
                {profile.experience.map((exp, i, ExpList) => {
                  return (
                    <li key={i} className={`pt-3 ${ExpList.indexOf(exp) === ExpList.length - 1 ? '' : 'border-bottom pb-3'}`}>
                      <div className='d-flex'>
                        <h6 className='mb-1 flex-grow-1'>
                          {exp.title}
                          <span className='text-secondary ms-2 fs-medium'>({exp.type})</span>
                        </h6>
                        {user._id === profile.user._id ?
                          <button className='btn-default-revert' onClick={() => setExpAlert(exp._id)}><i className="fa-solid fa-trash-can text-danger fs-medium"></i></button> : null
                        }
                      </div>
                      <div className='fs-medium mb-2'>
                        <i className="fa-solid fa-briefcase me-2"></i>
                        {exp.company}
                      </div>

                      {exp.location ?
                        <div className='fs-medium text-secondary'>
                          <i className="fa-solid fa-location-dot me-2"></i>{exp.location}
                        </div> : null}

                      <div className={`fs-medium text-secondary ${exp.description ? 'mb-3' : ''}`}>
                        <i className="fa-solid fa-calendar-week me-2"></i>{new Date(exp.from).toLocaleDateString() + ' to ' + (exp.to ? new Date(exp.to).toLocaleDateString() : 'present')}
                      </div>

                      {exp.description ?
                        <div className='fs-medium'>{exp.description}</div> : null
                      }

                      {exp._id === expAlert ?
                        <div className="d-flex justify-content-between align-items-center alert alert-danger mt-3 py-2 confirm-alert" role="alert">
                          <span>Are you sure you want to delete this experience.</span>
                          <div>
                            <button className="btn px-3 py-0 me-2 border-radius-5 fs-medium" onClick={() => setExpAlert(null)}>Cancel</button>
                            <button className="btn btn-danger px-3 py-0 border-radius-5 fs-medium" onClick={() => dispatch(deleteExperience(exp._id))}>Delete</button>
                          </div>
                        </div> : null}
                    </li>
                  )
                })}
              </ul> :
              <span>{`${user._id === profile.user._id ? 'You have' : `${profile.user.name} has`} not added any experience.`}</span>
            }
          </section>

          <section className='py-4 border-bottom'>
            <div className='d-flex'>
              <h4 className='fw-400 flex-grow-1'>Education</h4>
              {user._id === profile.user._id ?
                <button className='d-flex align-items-center btn bg-main color-main bg-hover-main rounded-circle profile-add-btn' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setContext('education')}>
                  <i className="fa-solid fa-plus"></i>
                </button> : null
              }
            </div>
            {profile.education.length ?
              <ul className='list-unstyled mb-0'>
                {profile.education.map((edu, i, EduList) => {
                  return (
                    <li key={i} className={`pt-3 ${EduList.indexOf(edu) === EduList.length - 1 ? '' : 'border-bottom pb-3'}`}>
                      <div className='d-flex'>
                        <h6 className='mb-1 flex-grow-1'>{edu.institution}</h6>
                        {user._id === profile.user._id ?
                          <button className='btn-default-revert' onClick={() => setEduAlert(edu._id)}><i className="fa-solid fa-trash-can text-danger fs-medium"></i></button> : null
                        }
                      </div>
                      <div className='fs-medium mb-2'>
                        <i className="fa-solid fa-graduation-cap me-2"></i>
                        {edu.degree}
                      </div>

                      <div className={`fs-medium text-secondary ${edu.description ? 'mb-3' : ''}`}>
                        <i className="fa-solid fa-calendar-week me-2"></i>{new Date(edu.from).toLocaleDateString() + ' to ' + (edu.to ? new Date(edu.to).toLocaleDateString() : 'present')}
                      </div>

                      {edu.description ?
                        <div className='fs-medium'>{edu.description}</div> : null
                      }

                      {edu._id === eduAlert ?
                        <div className="d-flex justify-content-between align-items-center alert alert-danger mt-3 py-2 confirm-alert" role="alert">
                          <span>Are you sure you want to delete this education.</span>
                          <div>
                            <button className="btn px-3 py-0 me-2 border-radius-5 fs-medium" onClick={() => setEduAlert(null)}>Cancel</button>
                            <button className="btn btn-danger px-3 py-0 border-radius-5 fs-medium" onClick={() => dispatch(deleteEducation(edu._id))}>Delete</button>
                          </div>
                        </div> : null}
                    </li>
                  )
                })}
              </ul> :
              <span>{`${user._id === profile.user._id ? 'You have' : `${profile.user.name} has`} not added any education.`}</span>
            }
          </section>

          <section className='py-4'>
            <h4 className='fw-400'>Social</h4>
            <ul className='list-unstyled d-flex flex-wrap mb-0'>
              {profile.social ?
                Object.keys(profile.social).map((item, i) => {
                  return (
                    <li key={i} className='fs-medium mx-2 my-2'>
                      <a href={profile.social[item]} target='_blank' rel='noreferrer' className='d-block text-primary text-decoration-none bg-main border-radius-10 border border-primary px-3 py-1'>
                        <i className={`me-2 ${item === 'website' ? 'fa-solid fa-link' : `fa-brands fa-${item === 'stackoverflow' ? 'stack-overflow' : item.toLowerCase()}`}`}></i>
                        <span>{item[0].toUpperCase() + item.slice(1, item.length).toLowerCase()}</span>
                      </a>
                    </li>
                  )
                }) : `${user._id === profile.user._id ? 'You have' : `${profile.user.name} has`} not added any links.`}
            </ul>
          </section>

          {user._id === profile.user._id ?
            <div className={`d-flex align-items-center confirm-alert ${deleteAlert ? 'alert alert-danger justify-content-between' : 'justify-content-end'}`}>
              {deleteAlert ? <span>Are you sure you want to delete your profile?</span> : null}
              <div>
                {deleteAlert ? <button className='btn me-2 border-radius-5 fs-medium' onClick={() => setDeleteAlert(false)}>Cancel</button> : null}
                <button className='btn btn-danger border-radius-5 delete-profile-btn' onClick={handleProfileDelete}>Delete profile</button>
              </div>
            </div> : null
          }
        </div>
      </main>
    </>
  )
}

export default Profile