import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { fetchPostsByIds } from '../../post/actions/postActions';


import MyProfilePage from '../MyProfilePage';
import Loader from '../../widgets/Loader';

class MyProfileContainer extends Component {
	componentDidMount() {
		const { myUserId } = this.props;
		this.props.getUser(myUserId);
	}

	render() {
		const { user, usersPosts, authenticated, isFetching, myUserId } = this.props;
		if(isFetching.users) {
			return (<Loader />);
		} else {
			if(!user.userData) {
				return(<h1 className="main-page-content">No user found</h1>)
			}
			return (<MyProfilePage {...user} 
							  id={ myUserId }
							  usersPosts={usersPosts} 
							  authenticated={authenticated} 
							  loadUsersPosts={this.props.getPostsByIds} 
							  isFetching={isFetching} />
			);
		}
	}
}


const mapStateToProps = (state) => {
	return {
		myUserId: state.auth.id,
		user: state.user,
		usersPosts: state.posts,
		isFetching: state.isFetching,
		authenticated: state.auth.authenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUser(id) {
			dispatch(fetchUser(id));
		},
		getPostsByIds(postsIds){
			dispatch(fetchPostsByIds(postsIds))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileContainer);