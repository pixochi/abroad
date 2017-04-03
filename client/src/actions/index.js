import { ActionTypes } from '../constants';
import axios from 'axios';

export const fetchPosts = filter => dispatch => {
    
    dispatch({ type: ActionTypes.FETCH_POSTS });

    let category = [];
    if(filter.category !== undefined){
        if(filter.category.indexOf("All") === -1){
            category = Array.isArray(filter.category) ? [...filter.category] : filter.category;
        }
    }
    
    axios.get('/api/posts',{params:{...filter,category}})
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_POSTS,
                posts: resp.data
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.FETCH_POSTS_ERROR,
                message: err
            });
        });
};


//Gets a single post
export const fetchSinglePost = id => dispatch => {
    
    dispatch({ type: ActionTypes.FETCH_SINGLE_POST });

    axios.get('/api/singlePost',{params:id })
        .then(resp => {
            dispatch({
                type: ActionTypes.RECEIVED_SINGLE_POST,
                singlePost: resp.data
            });
        })
        .catch(err => {
            console.log(err);
            dispatch({
                type: ActionTypes.FETCH_SINGLE_POST_ERROR,
                message: err
            });
        });
};

export const filterUpdate = (name,value) => {
    if(name === "category" && !Array.isArray(value)){
        value = [value];
    }
    return {
        type: ActionTypes.FILTER_UPDATE,
        name,
        value
    }
};