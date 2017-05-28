import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router';
import FileUploader, { FILE_FIELD_NAME } from '../widgets/FileUploader';

import countries from '../constants/countries';

const isInputEmpty = (value) => {
	if(!value) {
	  return true;
	} 
	return false;
}

const validate = (values) => {
const errors = {};
	
	//all values are required
	Object.keys(values).map(key => {
		if(isInputEmpty(values[key])){
			return errors[key]= "required field";
		}	
	});

	if(values.username && (values.username.length < 3 || values.username.length > 30)){
		errors.username = 'Your username must be between 3 and 30 characters long.'
	}


  return errors;
};

const renderField = (props) => {
	const { input, label, type, meta: { touched, error } } = props;
	return (
	<fieldset>
	    <label>{label}</label>
	    <div>
	      <input {...input} placeholder={label} type={type}/>
	      {touched && (error && <span>{error}</span>)}
	    </div>
  	</fieldset> );
}


class EditUserForm extends Component {

	constructor(){
		super();
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormSubmit = (editedFields) => {
		let userInfoChanged = false;

		//find out whether the user's information changed
		for(let userPropKey of Object.keys(this.props.userInfo)){
			if(this.props.userInfo[userPropKey] !== editedFields[userPropKey]){
				userInfoChanged = true;
				break;
			}
		}

		if(editedFields.username){
			editedFields.username = editedFields.username.trim();
		}

		//if the user didn't change any info, redirect him back to his profile
		if(userInfoChanged){
			this.props.editUser(editedFields);
		} else {
			browserHistory.push('/my-profile');
		}	
	}

	render(){

		const { handleSubmit, submitting, pristine} = this.props;
		const userImage = this.props.userInfo ? this.props.userInfo.image : "";

		return(
			<form onSubmit={handleSubmit(this.handleFormSubmit)} 
			encType="multipart/form-data" 
			className="editProfile">
				<div>
					<h2>Edit your profile</h2>
					<div>
						{ userImage && <img alt="profile-pic" src={userImage} className="profile-pic" /> }
						<label htmlFor="country_from">I'm from: </label>
						<Field name="country_from" component="select">
						<option key="-1" value="">Choose a country you're from</option>
							{ Object.values(countries).map((country,i) => <option key={i} value={country}>{country}</option> ) }
						</Field>

						<label htmlFor="country_in">I currently live in: </label>
						<Field name="country_in" component="select">
						<option key="-1" value="">Choose a country you live in</option>
							{ Object.values(countries).map((country,i) => <option key={i} value={country}>{country}</option> ) }
						</Field>

						<Field 
						name="username" 
						component={renderField} 
						label="Username" type="text"  />

						<label htmlFor={FILE_FIELD_NAME}>Change profile pic</label>
						<Field 
				        name={FILE_FIELD_NAME} 
				        component={FileUploader} />

					</div>
				</div>
					{this.props.errorMessage}
				<button disabled={submitting} type="submit" >Edit</button>
			</form>
		);		
	}

};

EditUserForm = reduxForm({
  form: 'editUser', // a unique identifier for this form
  validate
})(EditUserForm);

EditUserForm = connect(
  state => {
  	if(state.user.userData){
  		let { country_from, country_in, username, image, _id } = state.user.userData;
	  	return { initialValues: { country_from, country_in, username, image, _id } }
  	}
  	return {};
  },
)(EditUserForm)

export default EditUserForm;