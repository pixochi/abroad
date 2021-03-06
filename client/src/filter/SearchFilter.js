import React, { Component } from 'react';
import { Link } from 'react-router';

import countries from '../constants/countries';
import { date_ranges } from '../constants/post_created_ranges';
import FilterDropdown from '../widgets/FilterDropdown';
import CheckboxGroupCategories from '../widgets/CheckboxGroupCategories';


class SearchFilter extends Component {

	constructor(props){
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.state = {searchText:this.props.urlQuery.searchText}
	}

	handleInputChange(e){
		const input = e.target;
		if(input.name === "category" && !Array.isArray(input.value)){
			input.value = [input.value]
		}
		this.props.filterUpdate(input.name,input.value);
		this.setState({searchText:input.value});
	}

    render() {

    	const query = this.props.stateQuery;
    	const { country_from, country_in, category, date_posted, searchText } = query;
    	const { filterUpdate } = this.props;
        return(
        	<div className="container extended-filter">
        		<div className="six columns">
	            	<label htmlFor="country_from">From</label>
		        	 <FilterDropdown
			          options={countries}
			          name="country_from" 
			          defaultValue={country_from} 
			          optionChanged={filterUpdate} />
		        </div>
	 
	 			<div className="six columns">
	           		<label htmlFor="country_in">In</label>
			        <FilterDropdown
			          options={countries}
			          name="country_in" 
			          defaultValue={country_in} 
			          optionChanged={filterUpdate} />
		         </div>

		         <div className="six columns filter-search">
		         	 <label htmlFor="searchText">Search</label>
			         <input type="text"
			          name="searchText"
			          value={this.state.searchText}
			          placeholder="I need info about..." 
			          onChange={this.handleInputChange} />
		          </div>

		         <div className="five columns checkbox-group-categories">
		          <CheckboxGroupCategories
		           checkedOptions={category}
		           onCategoryChange={filterUpdate} />
		         </div>

		         <div className="twelve columns">
	           		<label htmlFor="date_posted">Posts created:</label>
			        <FilterDropdown
			          options={date_ranges}
			          name="date_posted" 
			  		  defaultValue={date_posted}
			          optionChanged={filterUpdate} />
		         </div>

		          <Link to={{pathname:"/posts", query}} className="offset-by-five three columns">
		          	<button>FILTER!</button>
		          </Link>
	          </div>
        );
    }
}

export default SearchFilter;