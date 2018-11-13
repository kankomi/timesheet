// import { GET_EVENTS, DELETE_EVENT, SET_EVENT } from '../actions/types';
import { SET_TIME, DELETE_TIME } from '../actions/types';

const initalState = {
  timesheet: []
};

export default function(state = initalState, action) {
  switch (action.type) {
    case SET_TIME:
      return state;
    case DELETE_TIME:
      return state;
    default:
      return state;
  }
}
