import { FETCH_POST, NEW_POST, ERROR_MESSAGE, DELETE_POST, CLEAR_SUGGESTION, SET_METADATA } from './types';

const server = 'http://localhost:8081/api/cost-of-module/'; 

function fetchSuggestions(name) {
  return (dispatch) => {
    fetch(`${server}?name=${name}`,  { crossDomain:true})
      .then(res => {
          return res.json()

      })
      .then(posts => {
        dispatch({
        type: FETCH_POST,
        payload: posts
      }) });
  }
}

function clearSuggestions()
{
  return (dispatch) =>{
    dispatch({
      type: CLEAR_SUGGESTION
    })
  }
}

function getPackageMetaData(suggestion) {
  return async (dispatch) => {
    const result = await (await fetch(`${server}/package-details?name=${encodeURI(suggestion.name)}`,  { crossDomain:true})).json();
    dispatch({
      type: SET_METADATA,
      payload: result
    })
    return result;
  }
}

function showError(error) {
  return (dispatch) => {
    dispatch({
      type: ERROR_MESSAGE,
      payload: { error: error }
    })
  }
}
export { fetchSuggestions, showError, getPackageMetaData, clearSuggestions };