import React, { Component } from 'react';
import AvatarImageCropper from 'react-avatar-image-cropper';
import ReactLoading from 'react-loading';

var ipfsAPI = require('ipfs-api');

class EthAvatarForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImageFile: null,
      selectedImageURL: null,
      title: null,

      uploadStarted: false,
      uploadComplete: false,
      uploadSuccessful: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handle apply avatar cropping
  handleApplyCropper = (file) => {
    this.setState({
      selectedImageFile: file,
      selectedImageURL: window.URL.createObjectURL(file)});
  }

  // handle form input change
  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  // handle form submit
  handleSubmit(event) {
    event.preventDefault();

    if(!this.state.selectedImageFile) {
      alert('Please select an Avatar image');
      return;
    }

    // update loading UI
    this.setState({uploadStarted: true});

    // First upload image to IPFS and get its hash
    var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}); // connect to the unfura IPFS node

    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.state.selectedImageFile);
    fileReader.onload = () => {
      var data = fileReader.result;
      var buffer = Buffer.from(data);
      ipfs.files.add(buffer, (err, result) => {
        if(err) {
          this.setState({ uploadComplete: true, uploadSuccessful: false });

          console.error('**Error uploading image to IPFS: ' + err);
          return;
        }

        var imageHash = result[0].hash;
        console.log("✓ image successfully uploaded to IPFS with hash: " + imageHash);

        // Now create another IPFS entry with the full avatar data (image hash + metadata)
        var avatarData = {
          imageHash: imageHash,
          title: this.state.title
        };
        var avatarDataBuffer = Buffer.from(JSON.stringify(avatarData));
        ipfs.files.add(avatarDataBuffer, (err, result) => {
          if(err) {
            this.setState({ uploadComplete: true, uploadSuccessful: false });

            console.error('**Error uploading avatar data to IPFS: ' + err);
            return;
          }

          var avatarDataHash = result[0].hash;
          console.log("✓ avatarData successfully uploaded to IPFS with hash: " + avatarDataHash);

          // Finally, write avatarDataHash to the smart contract
          var ethAvatarInstance = this.props.ethAvatarInstance;

          // watch the DidSetIPFSHash event
          var didSetIPFSHashEvent = ethAvatarInstance.DidSetIPFSHash();
          didSetIPFSHashEvent.watch((error, result) => {
              if(!this.state.uploadStarted || result.args.hashAddress!==this.props.ethAddress)
                return;

              if(error) {
                this.setState({ uploadComplete: true, uploadSuccessful: false });

                console.error('**Error uploading avatar data to the smart contract: ' + err);
                return;
              }

              console.log("✓ avatarDataHash successfully written to smart contract!");
              this.setState({ uploadComplete: true, uploadSuccessful: true });
            }
          );

          // call setIPFSHash
          ethAvatarInstance.setIPFSHash(avatarDataHash, { from: this.props.ethAddress })
        });
      });
    }
  }

  render() {

    if(!this.state.uploadStarted) {
      return(
        <div className="eth-avatar-form">
          <div className="avatar-image-cropper" style={{ width: '250px', height: '250px', border: '1px solid black' }}>
            <AvatarImageCropper apply={this.handleApplyCropper} text='Upload Avatar' />
          </div>
          <div className="avatar-preview">
            <h3>Preview</h3>
            <img src={this.state.selectedImageURL} role="presentation" />
          </div>
          <form className="avatar-metadata" onSubmit={this.handleSubmit}>
            <label>
              Title (optional):
              <input type="text" name="title" onChange={this.handleInputChange} />
            </label>
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    }

    if(!this.state.uploadComplete) {
      return(
        <div className="avatar-uploading">
          <h2>Uploading your avatar to the Ethereum blockchain...</h2>
          <p>Please be patient, this can take several minutes</p>
          <ReactLoading type='cylon' color='black'  />
        </div>
      );
    }

    if(this.state.uploadSuccessful) {
      return(
        <div className="avatar-uploading">
          <h2>Congratulations! You now have a new EthAvatar set!</h2>
        </div>
      );
    }

    return(
      <div className="avatar-uploading">
        <h2>ERROR: Error uploading your avatar to the blockchain. Please try again later.</h2>
      </div>
    );
  }
}

export default EthAvatarForm;
