import { combineReducers } from 'redux';
import timesheetReducer from './timesheetReducer';

export default combineReducers({
  timesheet: timesheetReducer
});
