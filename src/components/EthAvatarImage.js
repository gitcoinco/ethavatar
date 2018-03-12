import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Blockies from 'react-blockies-image';

var ipfsAPI = require('ipfs-api');


class EthAvatarImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: null,
      title: null
    };
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

  loadImageFromIPFS() {
    if(!this.props.ipfsHash)
      return;

    var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}); // connect to the unfura IPFS node

    // First fetch avatarData
    ipfs.files.get(this.props.ipfsHash, (err, result) => {
      if(err) {
        console.error('**Error fetching avatar data from IPFS: ' + err);
        return;
      }

      var hashContent = result[0].content;
      var avatarDataBuffer = Buffer.from(hashContent);
      var avatarData = JSON.parse(avatarDataBuffer.toString());

      // Now fetch the image itself
      ipfs.files.get(avatarData.imageHash, (err, result) => {
        if(err) {
          console.error('**Error fetching avatar image from IPFS: ' + err);
          return;
        }

        var imageContent = result[0].content;
        var imageBlob = new Blob( [ imageContent ], { type: "image/jpeg" } );

        this.setState({
          imageURL: window.URL.createObjectURL(imageBlob),
          title: avatarData.title
        });
      });
    });
  }

  render() {
    var size = this.props.size;
    if(!size)
      size = 200; // default to 200px if no size is provided


    if(this.props.ipfsHash) {

      if(this.state.imageURL) {
        return(
          <div className="eth-avatar-image">
            <Blockies seed={this.props.ethAddress} image={this.state.imageURL} size={size} border={size/(size/10)} />
            {this.state.title ? (<p>Title: {this.state.title}</p>):(<p></p>)}
          </div>
        );
      }

      this.loadImageFromIPFS();
      return(
        <div className="eth-avatar-image">
          Loading image from IPFS...
          <ReactLoading type='cylon' color='black'  />
        </div>
      );
    }


    return(
      <div className="eth-avatar-image">
        <Blockies seed={this.props.ethAddress} scale={size/8} />
      </div>
    );
  }
}

export default EthAvatarImage;
