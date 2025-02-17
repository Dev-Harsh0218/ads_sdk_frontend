import React,{useEffect,useState} from 'react';
import {serverUrl} from './const'
const TestSEE = () =>{
    const [event_message,setEventMessage] = ([]);

    useEffect(()=>{
        const event_source = new EventSource('http://$serverUrl/test/test-event')
        event_source.onmessage = (event) =>{
            const newMessage = JSON.parse(event.data);
            setEventMessage((prevMessages) => [...prevMessages,newMessage]);
        }
    },[])


    
    return (
        <h1> this is testing Server Side event {serverUrl}</h1>
    );
}

export default TestSEE;
