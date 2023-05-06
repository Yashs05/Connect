import axios from 'axios'

export const loadProfiles = value => async dispatch => {

    try {
        const response = await axios.get(`${process.env.REACT_APP_END_POINT}/api/profile/allprofiles${value ? `?search=${value}` : ''}`)

        dispatch({
            type: 'people/setList',
            payload: response.data
        })

    } catch (err) {
        dispatch({
            type: 'people/setErr',
            payload: true
        })
    }
}