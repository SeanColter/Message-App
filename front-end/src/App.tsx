import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Login from './components/Login'
import MessageTable from './components/MessageTable'
import NewMessage from './components/NewMessage'

export interface LoginToken {
  token: number,
  perms: string
}

export interface Message {
  id: number,
  userID: number,
  message: string
}

function App() {
  const [loginToken, setLoginToken] = useState<LoginToken | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:5000/messages', {
                method: 'GET',
                headers: {
                    'Authorization': `${loginToken?.token}`, // Pass the token in the header
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: Message[] = await response.json(); // Assuming backend returns messages
                setMessages(data); // Update the state with the fetched messages
            } else {
                console.error('Failed to fetch messages:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    if (loginToken) {
        fetchMessages();
    }
  }, [loginToken, setMessages]);

  const addMessage = useCallback((newMessage: Message) => {
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
  }, [messages, setMessages])

  const logoutHandler = () => {
    setMessages([])
    setLoginToken(null)
  }

  return (
    <div className="app-container">
      <h1>Message App</h1>
      {!loginToken && <Login setLoginToken={setLoginToken}/>}
      {loginToken && 
        <div>
          <MessageTable messages={messages}/>
          {loginToken.perms == "full" && <NewMessage loginToken={loginToken} addMessage={addMessage}/>}
          <button type="reset" onClick={logoutHandler}>Logout</button>
        </div>
      }
    </div>
  )
}

export default App
