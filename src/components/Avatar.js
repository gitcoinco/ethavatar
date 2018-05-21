import React, { Component } from 'react';
import AvatarImageCropper from 'react-avatar-image-cropper';
import ReactLoading from 'react-loading';
import Blockies from 'react-blockies';

const ipfsAPI = require('ipfs-api');

class Avatar extends Component {
  state = {
    // Image display
    imageURL: null,
    title: null,

    // Image form
    selectedImageFile: null,
    selectedImageURL: null,

    // Upload state
    uploadStarted: false,
    uploadComplete: false,
    uploadSuccessful: false,

    // Form state
    isChanging: false,
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.ipfsHash !== this.props.ipfsHash) {
      // Invalidate ipfsHash related state
      this.setState({
        imageURL: null,
        title: null
      });
    }
  }

  // handle apply avatar cropping
  handleApplyCropper = (file) => {
    this.setState({
      selectedImageFile: file,
      selectedImageURL: window.URL.createObjectURL(file)});
  }

  // handle form input change
  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value
    });
  }

  // handle clicking on Change button
  handleChangeButton = (event) => {
    this.setState({
      isChanging: true,
    });
    event.preventDefault();
  }

  handleResetForm = (event) => {
    this.setState({
      // Image display
      imageURL: null,
      title: null,

      // Image form
      selectedImageFile: null,
      selectedImageURL: null,

      // Upload state
      uploadStarted: false,
      uploadComplete: false,
      uploadSuccessful: false,

      // Form state
      isChanging: true,
    });
    event.preventDefault();
  }

  handleCancelLink = (event) => {
    this.setState({
      // Image display
      imageURL: null,
      title: null,

      // Image form
      selectedImageFile: null,
      selectedImageURL: null,

      // Upload state
      uploadStarted: false,
      uploadComplete: false,
      uploadSuccessful: false,

      // Form state
      isChanging: false,
    });
    event.preventDefault();
  }

  // handle form submit
  handleSubmit = (event) => {
    event.preventDefault();

    if(!this.state.selectedImageFile) {
      alert('Please select an Avatar image');
      return;
    }

    // update loading UI
    this.setState({uploadStarted: true});

    // First upload image to IPFS and get its hash
    const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}); // connect to the unfura IPFS node

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.state.selectedImageFile);
    fileReader.onload = () => {
      const data = fileReader.result;
      const buffer = Buffer.from(data);
      ipfs.files.add(buffer, (err, result) => {
        if(err) {
          this.setState({ uploadComplete: true, uploadSuccessful: false });

          console.error('**Error uploading image to IPFS: ' + err);
          return;
        }

        const imageHash = result[0].hash;
        console.log("✓ image successfully uploaded to IPFS with hash: " + imageHash);

        // Now create another IPFS entry with the full avatar data (image hash + metadata)
        const avatarData = {
          imageHash: imageHash,
          title: this.state.title
        };
        const avatarDataBuffer = Buffer.from(JSON.stringify(avatarData));
        ipfs.files.add(avatarDataBuffer, (err, result) => {
          if(err) {
            this.setState({ uploadComplete: true, uploadSuccessful: false });

            console.error('**Error uploading avatar data to IPFS: ' + err);
            return;
          }

          const avatarDataHash = result[0].hash;
          console.log("✓ avatarData successfully uploaded to IPFS with hash: " + avatarDataHash);

          // Finally, write avatarDataHash to the smart contract
          const ethAvatarInstance = this.props.ethAvatarInstance;

          // watch the DidSetIPFSHash event
          const didSetIPFSHashEvent = ethAvatarInstance.DidSetIPFSHash();
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

  loadImageFromIPFS = () => {
    if(!this.props.ipfsHash)
      return;

    const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}); // connect to the unfura IPFS node

    // First fetch avatarData
    ipfs.files.get(this.props.ipfsHash, (err, result) => {
      if(err) {
        console.error('**Error fetching avatar data from IPFS: ' + err);
        return;
      }

      const hashContent = result[0].content;
      const avatarDataBuffer = Buffer.from(hashContent);
      const avatarData = JSON.parse(avatarDataBuffer.toString());

      // Now fetch the image itself
      ipfs.files.get(avatarData.imageHash, (err, result) => {
        if(err) {
          console.error('**Error fetching avatar image from IPFS: ' + err);
          return;
        }

        const imageContent = result[0].content;
        const imageBlob = new Blob( [ imageContent ], { type: "image/jpeg" } );

        this.setState({
          imageURL: window.URL.createObjectURL(imageBlob),
          title: avatarData.title
        });
      });
    });
  }

  render() {
    // Image
    let size = this.props.size;
    if(!size) {
      size = 200; // default to 200px if no size is provided
    }

    if (this.props.ipfsHash) {
      if (this.state.imageURL) {
        return (
          <div className="blue-stripe">
            <img src={this.state.imageURL} style={{ width: size, height: size, border: '1px solid black' }} role="presentation" />
            {this.state.title ? (<p>Title: {this.state.title}</p>):(<p></p>)}
          </div>
        );
      }

      this.loadImageFromIPFS();

      return (
        <div className="blue-stripe">
          Loading image from IPFS...
          <ReactLoading type="bubbles" color="#25e899" width="100" height="30" />
        </div>
      );
    }

    console.log(this.state.isChanging)

    // Form
    if (this.state.isChanging) {
      if (!this.state.uploadStarted) {
        return (
          <div className="blue-stripe">
            {this.state.selectedImageURL ?
              <img src={this.state.selectedImageURL} role="presentation" />
            :
              <div className="avatar-image-cropper">
                <AvatarImageCropper apply={this.handleApplyCropper} text="Drag Here" icon={<img src="/images/upload.png" width="149" height="127" alt="Drag Here" />} />
              </div>
            }
            <form className="form-messages" onSubmit={this.handleSubmit}>
              <input type="submit" value="Send" />
            </form>
          </div>
        );
      }

      if (!this.state.uploadComplete) {
        return (
          <div className="gray-stripe">
            <div className="dashed-box">
              <ReactLoading type="bubbles" color="#25e899" width="100" height="100" />
            </div>
            <div className="form-messages">
              <h4>Please wait.</h4>
              <p>
                We are doing some<br />
                hardcore blockchain stuff
              </p>
            </div>
          </div>
        );
      }

      if (!this.state.uploadSuccessful) {
        return (
          <div className="gray-stripe">
            <img className="avatar-image" src="/images/upload-failed.png" width="269" height="269" alt="Upload Failed" />
            <div className="form-messages">
              <h2>Upload Failed</h2>
              <button onClick={this.handleResetForm}>Try Again</button>
              <a href="#" onClick={this.handleCancelLink}>Cancel</a>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="blue-stripe">
        <Blockies seed={this.props.ethAddress} scale={size / 8} />
        <button onClick={this.handleChangeButton}>Change</button>
      </div>
    );
  }
}

export default Avatar;
