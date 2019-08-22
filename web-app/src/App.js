import React from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'

const ABI = [ { "constant": false, "inputs": [], "name": "buyTicket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "getTicketPrice", "outputs": [ { "name": "", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "to", "type": "address" } ], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "totalTicket", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "remainingTickets", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "owner", "type": "address" } ], "name": "ticketCount", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

class App extends React.Component {

  state = {
    address: '',
    remaining: '',
    ticketCount: '',
  }

  async componentDidMount() {
    await window.ethereum.enable()
    this.w3 = new Web3(window.ethereum)
    const address = (await this.w3.eth.getAccounts())[0]
    this.setState({ address })
    this.contract = new this.w3.eth.Contract(
      ABI, "0x933256012d8cd505e8bf904f607ef770dd08dbe4")
    const remaining = await this.contract.methods.remainingTickets().call()
    this.setState({ remaining })
    const ticketCount = await this.contract.methods.ticketCount(address).call()
    this.setState({ ticketCount })

  }

  async buyTicket() {
    // 1 Get ticket price in ETH
    // 2 Send buy ticket transaction
    const ticketPrice = await this.contract.methods.
      getTicketPrice().call({ value: '1000000000000000000' })
    await this.contract.methods.
      buyTicket().send({
        from: this.state.address,
        value: ticketPrice,
      })
  }

  onChange(e) {
    this.setState({
      receiver: e.target.value,
    })
  }

  async transfer() {
    await this.contract.methods.transfer(this.state.receiver).send({
      from: this.state.address
    })
  }

  render() {
    return (
      <div className="App">
        <p>Your Address: {this.state.address}</p>
        <p>Ticket Contract: 0x933256012d8cd505e8bf904f607ef770dd08dbe4</p>
        <p>Remaining Ticket Count: {this.state.remaining}</p>
        <p>Your Ticket Count: {this.state.ticketCount}</p>
        <button onClick={this.buyTicket.bind(this)}>Buy a Ticket</button>
        <div>
          <input placeholder="receiver" onChange={this.onChange.bind(this)} />
          <button onClick={this.transfer.bind(this)}>Transfer a Ticket</button>
        </div>
      </div>
    );
  }
}

export default App;
