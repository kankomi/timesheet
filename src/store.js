import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore'; // make sure you add this for firestore
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

import myReducers from './reducers';

// initialize firebase instance with config from console
const firebaseConfig = {
  apiKey: 'AIzaSyD3doigdJ7OvUXJvdjmnu1FutkKbBTHDa4',
  authDomain: 'lena-timesheet.firebaseapp.com',
  databaseURL: 'https://lena-timesheet.firebaseio.com',
  projectId: 'lena-timesheet',
  storageBucket: 'lena-timesheet.appspot.com',
  messagingSenderId: '892611210322'
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

firebase.initializeApp(firebaseConfig);

// Initialize Firestore with timeshot settings
firebase.firestore().settings({ timestampsInSnapshots: true });

// Add BOTH store enhancers when making store creator
const createStoreWithFirebase = compose(
  reduxFirestore(firebase),
  reactReduxFirebase(firebase, rrfConfig)
)(createStore);

// Add firebase and firestore to reducers
const rootReducer = combineReducers({
  root: myReducers,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

// Create store with reducers and initial state
const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);
export default store;
