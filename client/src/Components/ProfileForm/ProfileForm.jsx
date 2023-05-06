import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import fetchLocation from '../../utils/fetchLocations'
import './profileform.css'
import { createProfile } from '../../actions/profile'
import { toFormData } from 'axios'

const ProfileForm = ({ setUpdate }) => {

  const dispatch = useDispatch()

  const { profile } = useSelector(state => state.profile)

  const [details, setDetails] = useState({
    status: profile ? profile.status : 'Full time employed',
    headline: profile ? profile.headline : '',
    location: profile ? profile.location : '',
    company: profile ? profile.company : '',
    skills: profile ? profile.skills : '',
    bio: profile ? profile.bio : '',
    linkedIn: profile ? profile.social?.linkedIn : '',
    github: profile ? profile.social?.github : '',
    stackoverflow: profile ? profile.social?.stackoverflow : '',
    website: profile ? profile.social?.website : '',
    youtube: profile ? profile.social?.youtube : '',
    facebook: profile ? profile.social?.facebook : ''
  })

  const [locationList, setLocationList] = useState([])

  const [locationValue, setLocationValue] = useState(profile ? profile.location : '')

  const [display, setDisplay] = useState(false)

  const timer = useRef()

  const handleChange = (e) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    if (e.target.name === 'location') {
      setLocationValue(e.target.value)

      if (details.location) setDetails({ ...details, location: '' })

      setLocationList([])
      setDisplay(false)

      if (e.target.value.trim()) {
        timer.current = setTimeout(() => {
          fetchLocation(e.target.value, setLocationList, setDisplay)
        }, 500)
      }
    }
    else {
      setDetails({
        ...details,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleLocationChange = (location) => {
    setDetails({
      ...details,
      location
    })
    setLocationValue(location)
    setDisplay(false)
    setLocationList([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!details.status || details.headline.trim().length < 15 || !details.location) {
      dispatch({
        type: 'alert/showAlert',
        payload: {
          msg: 'Please enter the details correctly.',
          success: false
        }
      })
    }
    else {
      const formData = toFormData(details)
      dispatch(createProfile(formData, profile, setUpdate))
    }
  }

  return (
    <main className='profile-form-container' style={{ padding: '0 20rem' }}>
      <div className='bg-white px-4 py-4 border-radius-10 my-5 profile-form-card'>
        <h3 className='fw-400 mb-3'>{profile ? 'Update profile' : 'Create your profile for better reach'}</h3>
        <small className='text-secondary'>* indicates required</small>

        <form className='mt-2' onSubmit={handleSubmit}>

          <div className='form-floating mb-3'>
            <select value={details.status} name='status' className='form-select border-input' id="status" onChange={handleChange}>
              <option value="Full time employed">Full time employed</option>
              <option value="Part time employed">Part time employed</option>
              <option value="Intern">Intern</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="Student">Student</option>
              <option value="Student">Unemployed</option>
            </select>
            <label htmlFor="status">Your current employment status*</label>
          </div>

          <div className='form-floating mb-3'>
            <input type='text' value={details.headline} name='headline' className='form-control border-input' id="headline" placeholder='A short description about you' onChange={handleChange} />
            <label htmlFor="headline" className='text-secondary'>Headline* <small>(minimum 15 characters)</small></label>
          </div>

          <div className='form-floating mb-3 position-relative'>
            <input type='text' value={locationValue} name='location' className='form-control border-input' id="location" placeholder='Your residing location' onChange={handleChange} />
            <label htmlFor="location" className='text-secondary'>Residing location*</label>

            {display ?
              <ul className='position-absolute bg-white w-100 px-0 py-2 box-shadow border-radius-10 ul list-unstyled'>
                {locationList.map((location, i) => {
                  return (
                    <li key={i} className='px-3 py-1 list-items' onClick={() => handleLocationChange(location.name + ', ' + location.country)}>{location.name + ', ' + location.country}</li>
                  )
                })}
              </ul> : null
            }
          </div>

          <div className='form-floating mb-3'>
            <input type='text' value={details.company} name='company' className='form-control border-input' id="company" placeholder='Your current company' onChange={handleChange} />
            <label htmlFor="company" className='text-secondary'>Your company/company you are employed at</label>
          </div>

          <div className='form-floating position-relative mb-3'>
            <input type='text' value={details.skills} name='skills' className='form-control border-input' id="skills" placeholder='Your current company' onChange={handleChange} />
            <label htmlFor="skills" className='text-secondary'>Skills <small>(use comma to add multiple skills)</small></label>
          </div>

          <div className='form-floating'>
            <textarea value={details.bio} name='bio' className='form-control border-input' id="bio" placeholder='Your bio' maxLength='1500' style={{ minHeight: '8rem', maxHeight: '15rem' }} onChange={handleChange} />
            <label htmlFor="bio" className='text-secondary'>Bio</label>
          </div>

          <h5 className='fw-400 mt-5 mb-3'>Social profiles</h5>

          <div className="row social-rows mb-3">
            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.linkedIn} name='linkedIn' className="form-control border-input" id="linkedIn" placeholder="LinkedIn" onChange={handleChange} />
                <label htmlFor="linkedIn" className='text-secondary'>
                  <i className="fa-brands fa-linkedin me-2"></i>
                  <span>LinkedIn</span>
                </label>
              </div>
            </div>

            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.github} name='github' className="form-control border-input" id="github" placeholder="Github" onChange={handleChange} />
                <label htmlFor="github" className='text-secondary'>
                  <i className="fa-brands fa-github me-2"></i>
                  <span>Github</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row social-rows mb-3">
            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.stackoverflow} name='stackoverflow' className="form-control border-input" id="stackoverflow" placeholder="Stackoverflow" onChange={handleChange} />
                <label htmlFor="stackoverflow" className='text-secondary'>
                  <i className="fa-brands fa-stack-overflow me-2"></i>
                  <span>Stackoverflow</span>
                </label>
              </div>
            </div>

            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.website} name='website' className="form-control border-input" id="floatingInputGroup2" placeholder="Website" onChange={handleChange} />
                <label htmlFor="website" className='text-secondary'>
                  <i className="fa-solid fa-link me-2"></i>
                  <span>Website<small> (any website link you want to share)</small></span>
                </label>
              </div>
            </div>
          </div>

          <div className="row social-rows">
            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.youtube} name='youtube' className="form-control border-input" id="youtube" placeholder="Youtube" onChange={handleChange} />
                <label htmlFor="youtube" className='text-secondary'>
                  <i className="fa-brands fa-youtube me-2"></i>
                  <span>Youtube</span>
                </label>
              </div>
            </div>

            <div className="col social-columns">
              <div className="form-floating">
                <input type="text" value={details.facebook} name='facebook' className="form-control border-input" id="facebook" placeholder="Facebook" onChange={handleChange} />
                <label htmlFor="facebook" className='text-secondary'>
                  <i className="fa-brands fa-facebook me-2"></i>
                  <span>Facebook</span>
                </label>
              </div>
            </div>
          </div>

          <div className={`d-flex mt-5 ${profile ? 'justify-content-end align-items-center' : 'justify-content-center'}`}>
            {profile ? <button className='btn px-4 py-2 border-radius-20 me-3' onClick={() => setUpdate(false)}>Cancel</button> : null}
            <button type="submit" className="btn btn-primary px-4 py-2 border-radius-20" disabled={!details.status || details.headline.trim().length < 15 || !details.location ? true : false}>{profile ? 'Save changes' : 'Create profile'}</button>
          </div>

        </form>
      </div>
    </main>
  )
}

export default ProfileForm