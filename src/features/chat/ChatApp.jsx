import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import "./chatApp.css";
import {baseAxios} from "../../utils/commonUtils";
import {decodeJwtToken, getToken, setAuthenticationHeader} from "../../app/auth/auth";
import {showErrorToast} from "../common/components/Toast";
import {decrypt} from "dotenv";
import jwtDecode from "jwt-decode";

var stompClient =null;
const ChatApp = () => {

    const [customers,setCustomers] = useState([]);

    const [privateChats, setPrivateChats] = useState(new Map());

    const [publicChats, setPublicChats] = useState([]);

    const [tab,setTab] =useState("CHATROOM");

    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    // console.log("getToken()===>",decodeJwtToken(getToken()))

    useEffect(() => {
        baseAxios.get(`http://localhost:9999/api/customers/all`,setAuthenticationHeader(getToken())).then(res => {
            console.log("res",res.data)
            const userData=decodeJwtToken(getToken());
            console.log("userData",userData)
            if(Array.isArray(res.data)){
                setCustomers(res.data.filter(c=>c.id!==userData.customerId));
            }

            setUserData({
                username: userData.customerId,
                receivername: '',
                connected: true,
                message: ''
            })
        }).catch(error => {
            showErrorToast(error.response.data.message);
        });
    }, []);

    console.log("customers===>",customers)

    useEffect(() => {
        console.log("userData===>",userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        console.log("Sock====>",Sock)
        stompClient = over(Sock);
        console.log("stompClient====>",stompClient)
        stompClient.connect({Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzIiwidGltZXpvbmUiOiJBc2lhL0NhbGN1dHRhIiwiY3VzdG9tZXJJZCI6IjY2MjUzYmM5NjMxNTMxNDhiNDBjNDFlMyIsInBsYW5OYW1lIjoiUFJFTUlVTSIsInVzZXJOYW1lIjoidGVzdDEyMyIsImV4cCI6MTcxMzgxNzY2MCwiaWF0IjoxNzEzNzgxNjYwLCJlbWFpbCI6Imhhcm1lZXRrYXVyc29oaTk1QGdtYWlsLmNvbSIsImNvbnRhY3RObyI6IiJ9.WG4-9F0PGkSQW1sI3fdK_djKG8KcNQfKYg6vlfnV-xc"},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send("/app/message", {Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzIiwidGltZXpvbmUiOiJBc2lhL0NhbGN1dHRhIiwiY3VzdG9tZXJJZCI6IjY2MjUzYmM5NjMxNTMxNDhiNDBjNDFlMyIsInBsYW5OYW1lIjoiUFJFTUlVTSIsInVzZXJOYW1lIjoidGVzdDEyMyIsImV4cCI6MTcxMzgxNzY2MCwiaWF0IjoxNzEzNzgxNjYwLCJlbWFpbCI6Imhhcm1lZXRrYXVyc29oaTk1QGdtYWlsLmNvbSIsImNvbnRhY3RObyI6IiJ9.WG4-9F0PGkSQW1sI3fdK_djKG8KcNQfKYg6vlfnV-xc"}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        console.log("payload==>",payload)
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        console.log("payload==> private",payload);
        console.log("privateChats==> private",privateChats);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log("er===>",err);

    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzIiwidGltZXpvbmUiOiJBc2lhL0NhbGN1dHRhIiwiY3VzdG9tZXJJZCI6IjY2MjUzYmM5NjMxNTMxNDhiNDBjNDFlMyIsInBsYW5OYW1lIjoiUFJFTUlVTSIsInVzZXJOYW1lIjoidGVzdDEyMyIsImV4cCI6MTcxMzgxNzY2MCwiaWF0IjoxNzEzNzgxNjYwLCJlbWFpbCI6Imhhcm1lZXRrYXVyc29oaTk1QGdtYWlsLmNvbSIsImNvbnRhY3RObyI6IiJ9.WG4-9F0PGkSQW1sI3fdK_djKG8KcNQfKYg6vlfnV-xc"}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message,
                status:"MESSAGE"
            };

            if(userData.username !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTIzIiwidGltZXpvbmUiOiJBc2lhL0NhbGN1dHRhIiwiY3VzdG9tZXJJZCI6IjY2MjUzYmM5NjMxNTMxNDhiNDBjNDFlMyIsInBsYW5OYW1lIjoiUFJFTUlVTSIsInVzZXJOYW1lIjoidGVzdDEyMyIsImV4cCI6MTcxMzgxNzY2MCwiaWF0IjoxNzEzNzgxNjYwLCJlbWFpbCI6Imhhcm1lZXRrYXVyc29oaTk1QGdtYWlsLmNvbSIsImNvbnRhY3RObyI6IiJ9.WG4-9F0PGkSQW1sI3fdK_djKG8KcNQfKYg6vlfnV-xc"}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }
    return (
        <div className="container">
            {userData.connected?
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            <li onClick={() => {
                                setTab("CHATROOM")
                            }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom
                            </li>
                            {customers.map((name, index) => (
                                <>
                                    <li onClick={() => {
                                        setTab(name)
                                    }} className={`member ${tab === name && "active"}`} key={index}>{name.username}
                                        <span className="online-dot"></span></li>

                                </>

                            ))}
                            <li onClick={() => {
                                setTab("name")
                            }} className={`member ${tab === "name" && "active"}`} key={"index"}>{"Test_User3"}
                                <span className="offline-dot"></span></li>
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}>send</button>
                        </div>
                    </div>}
                    {tab!=="CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat,index)=>(
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                        </div>
                    </div>}
                </div>
                :
                <div className="register">
                    <input
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>}
        </div>
    )
}

export default ChatApp
