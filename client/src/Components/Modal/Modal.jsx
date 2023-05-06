import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import fetchLocations from '../../utils/fetchLocations'
import { toFormData } from 'axios'
import { addEducation, addExperience } from '../../actions/profile'

const Modal = ({ context }) => {

    const dispatch = useDispatch()

    const initialExpCreds = {
        title: '',
        type: 'Full time',
        company: '',
        location: '',
        from: '',
        to: '',
        current: true,
        description: ''
    }

    const initialEduCreds = {
        institution: '',
        degree: '',
        field: '',
        from: '',
        to: '',
        current: true,
        description: ''
    }

    const [expCreds, setExpCreds] = useState(initialExpCreds)

    const [eduCreds, setEduCreds] = useState(initialEduCreds)

    const [locationValue, setLocationValue] = useState('')

    const [locationList, setLocationList] = useState([])

    const [locationDisplay, setLocationDisplay] = useState(false)

    const timer = useRef()

    const handleChange = (e) => {
        if (context === 'experience') {
            if (timer.current) {
                clearTimeout(timer.current)
            }

            if (e.target.name === 'location') {
                setLocationValue(e.target.value)

                if (expCreds.location) setExpCreds({ ...expCreds, location: '' })

                setLocationList([])
                setLocationDisplay(false)

                if (e.target.value.trim()) {
                    timer.current = setTimeout(() => {
                        fetchLocations(e.target.value, setLocationList, setLocationDisplay)
                    }, 500)
                }
            }
            else if (e.target.name === 'current') {
                setExpCreds({
                    ...expCreds,
                    current: !expCreds.current,
                    to: expCreds.to && ''
                })
            }
            else {
                setExpCreds({
                    ...expCreds,
                    [e.target.name]: e.target.value
                })
            }
        }
        else {
            if (e.target.name === 'current') {
                setEduCreds({
                    ...eduCreds,
                    current: !eduCreds.current,
                    to: eduCreds.to && ''
                })
            }
            else {
                setEduCreds({
                    ...eduCreds,
                    [e.target.name]: e.target.value
                })
            }
        }
    }

    const handleLocationChange = (location) => {
        setExpCreds({
            ...expCreds,
            location
        })
        setLocationValue(location)
        setLocationDisplay(false)
        setLocationList([])
    }

    const handleCancel = () => {
        if (context === 'experience') {
            setExpCreds(initialExpCreds)
        }
        else {
            setEduCreds(initialEduCreds)
        }
        document.getElementById("staticBackdrop").classList.remove("modal-backdrop", "show");
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (context === 'experience') {
            if (expCreds.title.trim() && expCreds.type && expCreds.company.trim() && expCreds.location && expCreds.from && (expCreds.current || expCreds.to)) {
                const formData = toFormData(expCreds)
                console.log(expCreds)
                dispatch(addExperience(formData, initialExpCreds, setExpCreds))
            }
        }
        else {
            if (eduCreds.institution.trim() && eduCreds.degree.trim() && eduCreds.from && (eduCreds.current || eduCreds.to)) {
                const formData = toFormData(eduCreds)
                dispatch(addEducation(formData, initialEduCreds, setEduCreds))
            }
        }
    }

    return (
        <div className="modal modal-lg fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">{context === 'experience' ? 'Add experience' : 'Add education'}</h1>
                        <button type="button" className="btn-close" aria-label="Close" data-bs-dismiss="modal" onClick={handleCancel}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} id='form'>
                            <div className="mb-3">
                                <label htmlFor={context === 'experience' ? 'title' : 'institution'} className="col-form-label py-0 fs-medium text-secondary">{context === 'experience' ? 'Job title*' : 'Institution*'}</label>
                                <input type="text" value={context === 'experience' ? expCreds.title : eduCreds.institution} name={context === 'experience' ? 'title' : 'institution'} className="form-control border-input" id={context === 'experience' ? 'title' : 'institution'} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                {context === 'experience' ?
                                    <>
                                        <label htmlFor="type" className="col-form-label py-0 fs-medium text-secondary">Type*</label>
                                        <select value={expCreds.type} name='type' className="form-select border-input" id="type" onChange={handleChange} >
                                            <option value="Full time employed">Full time</option>
                                            <option value="Part time employed">Part time</option>
                                            <option value="Intern">Internship</option>
                                            <option value="Freelancer">Freelancing</option>
                                            <option value="Entrepreneur">Self employed</option>
                                        </select>
                                    </> :
                                    <>
                                        <label htmlFor="degree" className="col-form-label py-0 fs-medium text-secondary">Degree*</label>
                                        <input type='text' name='degree' value={eduCreds.degree} className="form-control border-input" id="degree" onChange={handleChange} />
                                    </>
                                }
                            </div>

                            <div className="mb-3">
                                <label htmlFor={context === 'experience' ? 'company' : 'field'} className="col-form-label py-0 fs-medium text-secondary">{context === 'experience' ? 'Company*' : 'Field of study'}</label>
                                <input type="text" value={context === 'experience' ? expCreds.company : eduCreds.field} name={context === 'experience' ? 'company' : 'field'} className="form-control border-input" id={context === 'experience' ? 'company' : 'field'} onChange={handleChange} />
                            </div>

                            {context === 'experience' ?
                                <div className="mb-3 position-relative">
                                    <label htmlFor='location' className="col-form-label py-0 fs-medium text-secondary">Location</label>
                                    <input type="text" value={locationValue} name='location' className="form-control border-input" id='location' onChange={handleChange} />
                                    {locationDisplay ?
                                        <ul className='position-absolute bg-white w-100 px-0 py-2 box-shadow border-radius-10 ul list-unstyled'>
                                            {locationList.map((location, i) => {
                                                return (
                                                    <li key={i} className='px-3 py-1 list-items' onClick={() => handleLocationChange(location.name + ', ' + location.country)}>{location.name + ', ' + location.country}</li>
                                                )
                                            })}
                                        </ul> : null
                                    }
                                </div> : null
                            }

                            <div className='d-flex mb-3'>
                                <input type="checkbox" value={context === 'experience' ? expCreds.current : eduCreds.current} name='current' id="current" checked={context === 'experience' ? (expCreds.current && true) : (eduCreds.current && true)} onChange={handleChange} />
                                <label htmlFor="current" className='ps-1 text-secondary'>{`Currently ${context === 'experience' ? 'working' : 'studying'} here`}</label>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label htmlFor="from" className='fs-medium text-secondary'>Start date*</label>
                                    <input type="date" value={context === 'experience' ? expCreds.from : eduCreds.from} name='from' className='form-control border-input' id="from" onChange={handleChange} />
                                </div>
                                <div className='col-md-6'>
                                    <label htmlFor="to" className='fs-medium text-secondary'>End date*</label>
                                    <input type="date" value={context === 'experience' ? expCreds.to : eduCreds.to} name='to' className='form-control border-input' id="to" disabled={context === 'experience' ? (expCreds.current && true) : (eduCreds.current && true)} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='description' className="col-form-label py-0 fs-medium text-secondary">Description</label>
                                <textarea value={context === 'experience' ? expCreds.description : eduCreds.description} name='description' className="form-control border-input" id='description' maxLength='500' style={{ minHeight: '6rem', maxHeight: '12rem' }} onChange={handleChange} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn me-2 border-radius-20" data-bs-dismiss="modal" onClick={handleCancel}>Cancel</button>
                        <button type="submit" form='form' className="btn btn-primary px-5 border-radius-20" data-bs-dismiss="modal"
                            disabled={context === 'experience' ? (expCreds.title.trim() && expCreds.type && expCreds.company.trim() && expCreds.from && (expCreds.current || expCreds.to)) ? false : true :
                                eduCreds.institution.trim() && eduCreds.degree.trim() && eduCreds.from && (eduCreds.current || eduCreds.to) ? false : true} >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal