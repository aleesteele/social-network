import React from 'react';
import axios from '../../routes/axios';

export default class UpdateBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            email: this.props.email,
            image: this.props.image,
            userId: this.props.userId
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitChange = this.submitChange.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        this.setState({
            bioUpdate : e.target.value
        })
        // console.log('this is the bioUpdate: ', this.state.bioUpdate)
    }
    submitChange(e) {
        e.preventDefault();
        console.log('this.state.bioUpdate: ', this.state.bioUpdate)
        console.log('this.props.id: ', this.props.userId)
        axios.post('/update-bio', {
            bio: this.state.bioUpdate,
            userId: this.props.userid
        }).then(resp => {
            if (resp.data.success) {
                this.props.bioChanges(resp.data.bio)
            }
            else {
                console.log('ERR UPDATE BIO || UPDATE-BIO.JS');
                this.setState({ error: true })
            }
        }).catch(err => { console.log('ERR WITH AXIOSPOST || UPDATE BIO || ', err) })

    }
    render() {
        return (
            <form className="form">
                <textarea
                    type="bio"
                    name="bio"
                    placeholder={this.props.bio}
                    value={this.props.value}
                    onChange={this.handleChange}
                    className="bioTextarea"/><br/>
                <input
                    type="submit"
                    value="Submit"
                    onClick={this.submitChange}
                    className="bioForm"/>
            </form>
        )
    }
}
