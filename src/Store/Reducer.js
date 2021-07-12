import * as ActionTypes from './ActionTypes';

export default (state={ userInfo:{} }, action) => {
    const { userInfo } = action;
    switch (action.type) {
        case ActionTypes.LOG_IN:
            return { ...state, userInfo: userInfo };
        case ActionTypes.LOG_OUT:
            return {...state, userInfo: {}};
        default:
            return state;
    }
}