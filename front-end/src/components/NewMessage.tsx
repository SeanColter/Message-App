import React, { useState } from 'react';
import { LoginToken, Message } from "../App";

interface NewMessageProps {
    loginToken: LoginToken;
    addMessage: (message: Message) => void;
}

const NewMessage: React.FC<NewMessageProps> = ({ loginToken, addMessage }) => {
    const [newMessage, setNewMessage] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!newMessage) {
            alert("Message cannot be empty!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${loginToken.token}`, // Include token in headers for authentication
                },
                body: JSON.stringify({
                    message: newMessage, // Backend expects the message payload
                }),
            });

            if (response.ok) {
                const data: Message = await response.json();
                addMessage(data)
                setNewMessage(""); // Clear the input field
            } else {
                console.error("Failed to send message:", response.statusText);
                alert("Failed to send message!");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("An error occurred while sending the message!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="message">New Message:</label>
                <input
                    type="text"
                    id="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Message</button>
        </form>
    );
};

export default NewMessage;