import React, { Component } from 'react';
import Web3 from 'web3';
import NewContract from '../abis/NewContract.json';
import './App.css';
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non ethereum browser detected. You should consider trying metamask!g')
    }
  }

  async loadBlockChainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = NewContract.networks[networkId]
    
    if(networkData){
      const newContract = web3.eth.Contract(NewContract.abi, networkData.address)
      this.setState({newContract})
      const postCount = await newContract.methods.postCount().call()
      this.setState({postCount})
      console.log(postCount)

      for(var i = 1;i<=postCount ; i++){
        const post = await newContract.methods.posts(i).call()
        this.setState({
          posts : [...this.state.posts, post]
        })
      }
      this.setState({loading:false})
      console.log({posts : this.state.posts})
    }else{
      window.alert('NewContract contract not deployed on selected network!')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.newContract.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      newContract : null,
      postCount : 0 ,
      posts : [],
      loading : true
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account}/>
        {this.state.loading
        ? <div id='loader' className='text-center mt-5'><p>loading...</p></div>
        : <Main 
            posts = {this.state.posts}
            createPost = {this.createPost}
          />
        }
        
      </div>
    );
  }
}

export default App;
