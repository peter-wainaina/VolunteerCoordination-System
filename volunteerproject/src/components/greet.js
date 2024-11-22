import React from "react";

const greet = props =>{
    console.log(props)
    return<h1> Hello {props.name} also known as {props.propsName}</h1>
}

export default greet;