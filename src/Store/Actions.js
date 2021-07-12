import * as ActionTypes from './ActionTypes';

export const login = (userInfo) => {
    return {
        type:ActionTypes.LOG_IN,
        userInfo:userInfo
    }
};

export const logout = () => {
    return {
        type:ActionTypes.LOG_OUT,
        userInfo:{}
    }
};