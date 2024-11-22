import React, { Component } from 'react'

class Functionclick extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         message:'hello volunteer'
      }
      
    }
    eventChange(){
        this.setState({
           message:'Goodbye volunteer'
        })
        console.log(this)
    }
    
  render() {
    return (
      <div>
        <div>{this.state.message}</div>
        <button onClick={this.eventChange.bind(this)}>Click</button>
      </div>
    )
  }
}

export default Functionclick
