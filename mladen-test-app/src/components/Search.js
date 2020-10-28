import React from 'react';
import './Search.css';
import axios from 'axios';
import Loader from '../loader.gif'

class Search extends React.Component {
    constructor ( props ) {
        super ( props );

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: ''
        }
        this.cancel = '';
    }

    

    getSearchResults = ( query ) => {
        const url = `https://jsonplaceholder.typicode.com/posts?q=${query}`;
        if ( this.cancel ) {
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();
        axios.get ( url, { 
            cancelToken: this.cancel.token
        } )
        .then ( res => {
            const resultNotFound = ! res.data.length 
                                 ? 'There are no search results. Please try a new search ...'
                                 : '';
            this.setState ( {
                results : res.data,
                message : resultNotFound,
                loading : false
            } )
        } ) 
        .catch ( error => {
            if ( axios.isCancel( error ) || error ) {
                this.setState ( {
                    loading : false,
                    message : 'Sorry we could not find anything'
                } )
            }
        } )

    }

    onInputChange = ( event ) => {
        const query = event.target.value;
        if ( ! query ){
            this.setState ( { query, results : {}, message : '' } )
        } else {
        this.setState ( {query, loading : true, message : '' }, () => {
            this.getSearchResults ( query );
        }  );
        }
    };
    
    renderSearchResults = () => {
        const { results } = this.state;
        if ( Object.keys ( results ).length && results.length ) {
            return (
                <div className="results-c">
                    { results.map ( result => {
                        return (
                            <div className="results-c">
                                <div className="result-c-holder">
                                    <h3 className="results-c-title">{ result.title}</h3>
                                    <p className="results-c-body">{result.body}</p>
                                </div>
                            </div>
                        )
                    } ) }
                </div>
            ) 
            
        }
    }

    render() {
        const { query, loading, message } = this.state;
        return (
            <div className="container">
                <h2 className="heading">Search posts from API</h2>
                <label className="search-label" htmlFor="search-input">
                    <i className="fas fa-search"></i>
                    <input
                        name="query"
                        className="search-input"
                        type="text"
                        value={query}
                        placeholder="Search for post ..."
                        onChange={this.onInputChange}
                        />                    
                </label>
                { message && <p className="message">{ message }</p>}
                <img src={ Loader } className={ `search-loading ${ loading ? 'show' : 'hide' } `} alt="Loader"></img>
                
                { this.renderSearchResults() }
            </div>
        )
    }
}

export default Search