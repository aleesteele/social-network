import React from 'react';
import axios from '../../routes/axios';

export default class PicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFile = this.handleFile.bind(this);
        this.submitUpload = this.submitUpload.bind(this);
    }
    handleFile(e) {
        this.setState({
            file : e.target.files[0]
        });
    }
    submitUpload(e) {
        e.preventDefault();
        var file = this.state.file;
        var formData = new FormData();
        formData.append('file', file);
        // console.log('FORMDATA', formData, 'FILE', file)
        axios.post('/upload-prof-pic', formData).then(({data}) => {
            console.log('UPLOAD PROF PIC || DATA || PICUPLOAD.JS: ', data)
            this.props.updateImage(data.newPic)
        }).catch(err => {
            console.log('ERR WITH AXIOM || PROF PIC UPLOAD || ', err)
            this.setState({
                error : true
            })
        })
    }
    render() {
        console.log('INSIDE PIC UPLOAD COMPONENT');
        return (
            <div>
                {this.state.error && <div className="error">There was an error. Please try again.</div>}
                <form className="form">
                    <input
                        type="file"
                        name="file"
                        onChange={this.handleFile}
                        className="form"
                        ref={ref => this.fileInput = ref}/>
                    <input
                        type="submit"
                        value="Submit"
                        onClick={this.submitUpload}
                        className="form"/>
                </form>

            </div>
        )
    }

}
