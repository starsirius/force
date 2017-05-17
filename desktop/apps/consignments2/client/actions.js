import request from 'superagent'
import { data as sd } from 'sharify'
import { push } from 'react-router-redux'

// Action types
export const CLEAR_ARTIST_SUGGESTIONS = 'CLEAR_ARTIST_SUGGESTIONS'
export const CLEAR_LOCATION_SUGGESTIONS = 'CLEAR_LOCATION_SUGGESTIONS'
export const HIDE_NOT_CONSIGNING_MESSAGE = 'HIDE_NOT_CONSIGNING_MESSAGE'
export const INCREMENT_STEP = 'INCREMENT_STEP'
export const SHOW_NOT_CONSIGNING_MESSAGE = 'SHOW_NOT_CONSIGNING_MESSAGE'
export const UPDATE_ARTIST_AUTOCOMPLETE_VALUE = 'UPDATE_ARTIST_AUTOCOMPLETE_VALUE'
export const UPDATE_ARTIST_ID = 'UPDATE_ARTIST_ID'
export const UPDATE_ARTIST_SUGGESTIONS = 'UPDATE_ARTIST_SUGGESTIONS'
export const UPDATE_INPUTS = 'UPDATE_INPUTS'
export const UPDATE_LOCATION_AUTOCOMPLETE_VALUE = 'UPDATE_LOCATION_AUTOCOMPLETE_VALUE'
export const UPDATE_LOCATION_SUGGESTIONS = 'UPDATE_LOCATION_SUGGESTIONS'
export const UPDATE_LOCATION_VALUES = 'UPDATE_LOCATION_VALUES'
export const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION'

// Action creators
export function chooseArtistAndAdvance (value) {
  return (dispatch) => {
    dispatch(updateArtistId(value._id))
    dispatch(incrementStep()) // move to next step
  }
}

export function chooseLocation (location) {
  return {
    type: UPDATE_LOCATION_VALUES,
    payload: {
      location
    }
  }
}

export function clearArtistSuggestions () {
  return {
    type: CLEAR_ARTIST_SUGGESTIONS
  }
}

export function clearLocationSuggestions () {
  return {
    type: CLEAR_LOCATION_SUGGESTIONS
  }
}

export function createSubmission () {
  return (dispatch) => {
    // TODO: async request to convection to create submission
    dispatch(updateSubmission()) // update state
    dispatch(incrementStep()) // move to next step
  }
}

export function fetchArtistSuggestions (value) {
  return async (dispatch, getState) => {
    try {
      const res = await request
                          .get(`${sd.API_URL}/api/v1/match/artists`)
                          .query({ visible_to_public: 'true', term: value })
                          .set('X-ACCESS-TOKEN', sd.CURRENT_USER.accessToken)
      dispatch(updateArtistSuggestions(res.body))
      dispatch(hideNotConsigningMessage())
    } catch (err) {
      console.error('error!', err)
    }
  }
}

export function fetchLocationSuggestions (value) {
  return async (dispatch, getState) => {
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
      const res = await request
                          .get(url)
                          .query({ input: value, key: sd.GOOGLE_MAPS_API_KEY })
      dispatch(updateLocationSuggestions(res.body))
    } catch (err) {
      console.error('error!', err)
    }
  }
}

export function hideNotConsigningMessage () {
  return {
    type: HIDE_NOT_CONSIGNING_MESSAGE
  }
}

export function incrementStep () {
  return {
    type: INCREMENT_STEP
  }
}

export function showNotConsigningMessage () {
  return {
    type: SHOW_NOT_CONSIGNING_MESSAGE
  }
}

export function submitDescribeWork (values) {
  return (dispatch) => {
    dispatch(updateInputs(values)) // update the inputs in case we have to return
    dispatch(createSubmission()) // create the submission in convection
  }
}

export function submitPhoto () {
  return (dispatch) => {
    // this will come from the response of the PUT request to convection
    const dummySubmission = {
      id: 'subbymission',
      image_url: null
    }
    dispatch(updateSubmission(dummySubmission))
    dispatch(push('/consign2/submission/thank_you'))
  }
}

export function updateArtistAutocompleteValue (value) {
  return {
    type: UPDATE_ARTIST_AUTOCOMPLETE_VALUE,
    payload: {
      value
    }
  }
}

export function updateArtistId (artistId) {
  return {
    type: UPDATE_ARTIST_ID,
    payload: {
      artistId
    }
  }
}

export function updateArtistSuggestions (suggestions) {
  return {
    type: UPDATE_ARTIST_SUGGESTIONS,
    payload: {
      suggestions
    }
  }
}

export function updateInputs (inputs) {
  return {
    type: UPDATE_INPUTS,
    payload: {
      inputs
    }
  }
}

export function updateLocationAutocompleteValue (value) {
  return {
    type: UPDATE_LOCATION_AUTOCOMPLETE_VALUE,
    payload: {
      value
    }
  }
}

export function updateLocationSuggestions (suggestions) {
  return {
    type: UPDATE_LOCATION_SUGGESTIONS,
    payload: {
      suggestions
    }
  }
}

export function updateSubmission (submission) {
  return {
    type: UPDATE_SUBMISSION,
    payload: {
      submission
    }
  }
}
