import React, {Component} from 'react';
import Identicon from 'identicon.js';

class Main extends Component{
    render(){
        return(
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth : '500px'}}>
                    <form onSubmit={(event)=>{
                                event.preventDefault()
                                const content = this.postContent.value
                                this.props.createPost(content)
                            }}>
                        
                        <div className="form-group mr-sm-2"  >
                            <input 
                                type="text" 
                                className="form-control" 
                                id="postContent" 
                                ref={(input) => {this.postContent = input}}
                                placeholder="Create Post"
                                required/>
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>

                    <div className="content mr-auto ml-auto">
                        {this.props.posts.map((post,key) =>{
                        return(
                            <div className="card mb-4" key={key}>
                            <div className="card-header">
                            <img 
                                    className='mr-2'
                                    width='30'
                                    height='30'
                                    src={`data:image/png;base64,${new Identicon(post.author,30).toString()}`}
                                />
                                <small className='text-muted'>{post.author}</small>
                            </div>
                            <ul id='postList' className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                <p>{post.content}</p>
                                </li>
                                <li key={key} className='list-group-item py-2'>
                                <small className='float-left mt-1 text-muted'>
                                    Tips: {window.web3.utils.fromWei(post.tipAmount.toString(),'Ether')}
                                </small>
                                <button className='btn btn-link btn-sm float-right pt-0'>
                                    <span>
                                    TIP 0.1 ETH
                                    </span>
                                </button>
                                </li>
                            </ul>
                            </div>
                        )
                        })
                        }
                    </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default Main;