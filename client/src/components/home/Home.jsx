import React, { useState } from 'react'
import Conversation from '../conversation/Conversation'
import Message from '../message/Message'
import classes from './home.module.css'
import Woman from '../../assets/woman.avif'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io } from "socket.io-client";
import { useRef } from 'react'


const Home = () => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [lastConversationClicked, setLastConversationClicked] = useState("")
  const [comingMessage, setComingMessage] = useState("")
  const [otherUser, setOtherUser] = useState("")
  const { user, token } = useSelector((state) => state.auth)
  const socket = useRef()

  
  useEffect(() => {
    socket.current = io("ws://localhost:8080");
    socket.current.on("getMessage", (data) => {
      console.log(data)
      setComingMessage({
        senderId: data.senderId,
        messageText: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  
  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user]);

  useEffect(() => {
    comingMessage &&
      lastConversationClicked?.members.includes(comingMessage.senderId) &&
      setMessages((prev) => [...prev, comingMessage]);
  }, [comingMessage, lastConversationClicked]);


  useEffect(() => {
    const fetchUserConvos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/conversation/find/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const convos = await res.json()
        setConversations((prev) => convos)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUserConvos()
  }, [user._id])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/message/${lastConversationClicked._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const messages = await res.json()
        setMessages((prev) => messages)
      } catch (error) {
        console.error(error)
      }
    }
    lastConversationClicked && fetchMessages()
  }, [lastConversationClicked])

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const otherUserId = lastConversationClicked?.members?.find((member) => member !== user._id)
        const res = await fetch(`http://localhost:5000/user/find/${otherUserId}`)
        const data = await res.json()
        setOtherUser((prev) => data)
      } catch (error) {
        console.error(error)
      }
    }
    lastConversationClicked && fetchOtherUser()
  }, [lastConversationClicked])

  const handlePostMessage = async() => {
    try {
      const res = await fetch(`http://localhost:5000/message`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({conversationId: lastConversationClicked._id, messageText: message})
      })
      const data = await res.json()
      setMessages((prev) => [...prev, data])

      const otherUserId = lastConversationClicked?.members?.find((member) => member !== user._id)

      socket.current.emit("sendMessage", {
        senderId: user._id,
        otherUserId,
        text: message
      });

      setMessage('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h2 className={classes.title}>WebDevMania</h2>
          {conversations?.map((c) => (
            <div onClick={() => setLastConversationClicked(c)}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
        <div className={classes.right}>
          {otherUser ? 
            <>
              <div className={classes.otherUserData}>
                <img src={Woman} className={classes.otherUserImg} />
                <h4 className={classes.personUsername}>{otherUser?.username}</h4>
              </div>
              <div className={classes.messages}>
                {messages?.length > 0 ? messages?.map((message) => (
                  <Message messages={messages} key={message._id} own={message.senderId === user._id} message={message} />
                )) : <h1 style={{textAlign: 'center', color: '#fff'}}>No messages yet, be the first one to send!</h1>}
              </div>
            </>
            : (
              <h1 style={{textAlign: 'center', marginTop: '2rem', color: '#fff'}}>Click a conversation!</h1>
            )
          }
          <div className={classes.inputAndBtn}>
            <input value={message} onChange={(e) => setMessage(prev => e.target.value)} className={classes.input} type="text" placeholder='Type message...' />
            <button onClick={handlePostMessage} className={classes.submitBtn}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home