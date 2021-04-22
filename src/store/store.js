import { createStore } from 'redux';
import { chequeReducer } from './reducers/chequeReducer';

let store = createStore(chequeReducer);

export default store;