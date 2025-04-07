import React from "react";
import { Message } from "../App";

interface MessageTableProps {
    messages: Message[];
}

const MessageTable: React.FC<MessageTableProps> = ({ messages }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((msg) => (
                    <tr key={msg.id}>
                        <td>{msg.id}</td>
                        <td>{msg.userID}</td>
                        <td>{msg.message}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MessageTable;