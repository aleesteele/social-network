import React from 'react';
import axios from '../../routes/axios';
import ProfPic from './prof-pic';
import PicUpload from './pic-upload';
import UpdateBio from './update-bio';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log('MOUNTING PROFILE COMPONENT');
    }
    render() {
        const { firstname, lastname, email, userId, image, bio, switchUploaderValue, toggleBioChanger} = this.props
        console.log("toggle uploader thing", this.props.switchUploaderValue);
        console.log("toggle uploader thing", this.props.toggleBioChanger);
        if (!this.props) {
            return (
                <div className="loading">
                    <img src="loading.gif"/>
                </div>
            )
        }
        return (
                <div className="profile">
                    <div className="pic-in-profile">
                        {<ProfPic
                        firstname={firstname}
                        lastname={lastname}
                        email={email}
                        image={image}
                        bio={bio}
                        />}
                        <button onClick={this.props.switchUploaderValue} className="button">Want to change your prof pic?</button>
                        {/* <button onClick={this.props.toggleBioChanger} className="button">Want to edit your bio?</button> */}

                    </div>
                    <div className="bio-in-prof"><p>
                        <h1>Name:</h1> <h2>{this.props.firstname} {this.props.lastname}</h2><br />
                        <h1>Email:</h1> <h2>{this.props.email}</h2><br />
                        <h1>Bio:</h1> <h2>{this.props.bio}</h2>

                    </p></div><br/><br/>
                    <div className="bio-in-profile">
                        <UpdateBio
                        firstname={firstname}
                        lastname={lastname}
                        email={email}
                        userId={userId}
                        bio={bio}
                        />
                    </div>
                </div>
        )
    }
}
