import React from 'react';
import PicUpload from './pic-upload';
import UpdateBio from './update-bio';
import axios from '../../routes/axios';

export default class ProfPic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            email: this.props.email,
            image: this.props.image,
            userId: this.props.userId
        }
    }
    componentDidMount() {
        console.log('MOUNTING PROFILEPIC COMPONENT');
    }
    render() {
        console.log('INSIDE PROFILE COMPONENT')
        let picture;
        if (!this.props.image) {
            picture = "/default-prof-pic.jpg"
            //add something for loading
        }
        else {
            picture = this.props.image;
        }
        console.log('this is the this.props.image', this.props.image)
        return (
            <div>
                <img src={picture} className="prof-pic"/>
            </div>
        )
    }

}

{/* <img src={picture} className="prof-pic" onClick={this.props.toggleUploader} /> */}
