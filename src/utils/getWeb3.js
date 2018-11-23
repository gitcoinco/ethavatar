import Web3 from 'web3'

export const getWeb3 = () => new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async function() {
    var results
    var ethereum = window.ethereum
    var web3 = window.web3

    // Modern dapp browsers...
    if (typeof ethereum !== 'undefined') {
        web3 = new Web3(ethereum)
        try {
            await ethereum.enable()

            results = {
              web3: web3
            }

            console.log('Injected web3 detected.')
            resolve(results)

        } catch (error) {
            reject(new Error('User denied account access...'))
        }
    }
    // Legacy dapp browsers...
    else if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider)

      results = {
        web3: web3
      }

      console.log('Injected web3 detected.')
      resolve(results)
    }
    // Non-dapp browsers...
    else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')

      web3 = new Web3(provider)

      results = {
        web3: web3
      }

      console.log('No web3 instance injected, using Local web3.')
      resolve(results)
    }
  })
})
