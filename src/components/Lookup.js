import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Blockies from 'react-blockies';

const ipfsAPI = require('ipfs-api');

class Lookup extends Component {
  state = {
    address: '',
    isLoading: false,
    imageURL: null,
  }

  handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      imageURL: null,
      [name]: value
    });
  }

  handleLookup = async () => {
    try {
      this.setState({ isLoading: true });

      // Get the avatar from the Eth Avatar contract using the supplied address
      const ipfsHash = await this.props.ethAvatarInstance.getIPFSHash.call(this.state.address);
      const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'}); // connect to the infura IPFS node

      // Fetch avatarData
      const avatarResult = await ipfs.files.get(ipfsHash);
      const hashContent = avatarResult[0].content;
      const avatarDataBuffer = Buffer.from(hashContent);
      const avatarData = JSON.parse(avatarDataBuffer.toString());

      // Fetch the image itself
      const imageResult = await ipfs.files.get(avatarData.imageHash);
      const imageContent = imageResult[0].content;
      const imageBlob = new Blob( [ imageContent ], { type: "image/jpeg" } );

      this.setState({
        isLoading: false,
        imageURL: window.URL.createObjectURL(imageBlob),
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="avatar-lookup">
        <div className="lookup-form">
          <h4>Find Avatar for Any ETH Address:</h4>
          <input type="text" name="address" value={this.state.address} onChange={this.handleInputChange} />
          <button onClick={this.handleLookup}>Lookup</button>
        </div>
        {this.state.isLoading ? <ReactLoading type="bubbles" color="#25e899" width={100} height={30} /> :
          this.state.imageURL && (
            <div className="lookup-result">
              <div className="left">
                <img src={this.state.imageURL} role="presentation" />
              </div>
              <div className="right">
                <h4>Search Result For:</h4>
                <p>{this.state.address}</p>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export default Lookup
