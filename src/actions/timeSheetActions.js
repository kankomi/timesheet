import { SET_TIME, DELETE_TIME } from './types';

export const deleteTime = id => {
  return { type: DELETE_TIME, payload: id };
};

export const setTime = (from, to, breakFrom, breakTo) => {
  return { type: SET_TIME, payload: { from, to, breakFrom, breakTo } };
};
