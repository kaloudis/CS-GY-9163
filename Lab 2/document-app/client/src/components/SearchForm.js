import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ''
        }
    }

    componentDidMount() {
        window.addEventListener('keypress', this.handleKeyPress, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        // [Enter] should not submit the form when choosing an address.
        if (event.keyCode === 13) {
            event.preventDefault();
            this.props.searchDocuments(this.state.query);
        }
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        });
    }

    render() {
        return(
            <form>
                <input
                    type="text"
                    name="search"
                    placeholder="Search documents..."
                    className="SearchForm"
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                />
                <p>{this.state.query}</p>
            </form>
        )
    }
}

SearchForm.propTypes = {
    searchDocuments: PropTypes.func.isRequired
};