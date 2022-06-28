import { ERROR_MESSAGE, FETCH_POST, NEW_POST, DELETE_POST, CLEAR_SUGGESTION, SET_METADATA } from '../actions/types';

const initialState = {
  items: [],
  item: 'test',
  searchSuggestions: []
}

export default function (state = initialState, action) {
  //console.log(action);
  switch (action.type) {
    case FETCH_POST:
      return {
        ...state,
        searchSuggestions: action.payload
      }
    case NEW_POST:
      const items = state.items.map(item=>{
        return item;
      })

      items.push(action.payload);
      return {
        ...state,
        item: action.payload,
        items: items,
        error: undefined
      }
    case ERROR_MESSAGE:
    return {
      ...state,
      error: action.payload.error
    }
    case DELETE_POST:
      const filteredItems = state.items.filter(item=>
        item.email !== action.payload.email
      )
    return {
      ...state,
      items: filteredItems
    }
    case CLEAR_SUGGESTION:
      return {
        ...state,
        searchSuggestions:[]
      }
    case SET_METADATA:
      return {
        ...state,
        metadata: action.payload
      }
    default:
      return state;
  }
}