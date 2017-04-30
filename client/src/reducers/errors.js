import { ActionTypes } from '../constants';

export const errors = (state="",action) => {
    switch (action.type) {
        case ActionTypes.FETCH_POSTS_ERROR:
        case ActionTypes.ADD_COMMENT_ERROR:
        case ActionTypes.EDIT_POST_ERROR:
            return action.message;
        case "@@redux-form/DESTROY": //when navigating away from the form  clear errors
			return "";
        default:
            return state;
    }
}

