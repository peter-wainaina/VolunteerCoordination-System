import logo from './logo.svg';
import './App.css';
import './aap.css';
import Signuppage from './pages/Signuppage';

import React,{ Component, useEffect} from 'react';
import Background from './pages/background/background'
import Aap from './pages/app/aap'


class App extends Component{
  render () {
    return(
      <div className ="App">
       {/* <Greet name='bruce' propsName='bruce wayne'></Greet>
       <Greet name='mike' propsName='mikey'></Greet>
       <Greet name='neymar' propsName='joker'></Greet> */}

      {/*<Message></Message>*/}
      {/*<Landingpage></Landingpage>*/}
      
      
      <Aap></Aap>
    </div>
    );
  }
}


export default App