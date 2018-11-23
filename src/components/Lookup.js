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

  renderAvatar() {
    if (this.state.isLoading) {
      return <ReactLoading type="bubbles" color="#25e899" width={100} height={30} />
    } else if (this.state.imageURL) {
      return (
        <div className="lookup-result">
          <div className="left">
            <img src={this.state.imageURL} role="presentation" />
          </div>
          <div className="right">
            <h4>Search Result For:</h4>
            <h4>{this.state.address}</h4>
            <a href={`https://etherscan.io/address/${this.state.address}`} target="_blank">View On Etherscan</a>
          </div>
        </div>
      )
    } else if (this.state.address) {
      return <Blockies seed={this.state.address} scale={25} />
    }
  }

  render() {
    return (
      <div className="avatar-lookup">
        <h4>Find Avatar for Any ETH Address:</h4>
        <div className="lookup-form">
          <input type="text" name="address" value={this.state.address} onChange={this.handleInputChange} placeholder="Enter any Ethereum Address" />
          <button onClick={this.handleLookup}>Lookup</button>
        </div>
        {this.renderAvatar()}
      </div>
    )
  }
}

export default Lookup
