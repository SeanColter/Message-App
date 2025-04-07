# Message App

## Overview
This project combines a React-based frontend with a Python server backend. The frontend handles user interaction and UI, while the backend provides APIs and server-side logic.

## Technologies Used
- **Frontend**: React
- **Backend**: Python (Flask)
- **Database**: CSV file

## Installation

### Prerequisites
- Node.js and npm installed
- Python installed

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/SeanColter/Message-App.git
   ```

2. Running the Server
   ```bash
   cd server
   virtualenv .venv # Create Virtual Environemnt
   venv/Scripts/activate # Enter Virtual Environemnt
   pip install -r requirements.txt # Install Deps
   py server.py # Runs server at localhost:5000
   ```

3. Running the Front End
   ```bash
   cd front-end
   npm install # Instal Deps
   npm run dev # Runs React App at localhost:5173
   ```

### How it works

Currently the App is setup with hardcoded users where the password to login matches the username.
There are 4 current users, 2 administrator users who can view and create messages and 2 limited users who can only view messages.
administrators: `admin` (userID 1) and `boss` (userID 2)
limited users: `user` and `viewer`

The Server will generate and use a `messages.csv` file to store messages that are created by the `boss` or `admin` users

The login and authorization is a simple number of the user ID. this is not meant to be secure and a proper implementation would instead use a Database with hashed passwords and create JWTs for Authorization
