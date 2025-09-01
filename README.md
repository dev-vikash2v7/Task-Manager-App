<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-React_Native-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
   <img src="https://img.shields.io/badge/Firebase-red?style=for-the-badge&logoColor=white&logo=firebase&color=red"" alt="firebase" />
   <img src="https://img.shields.io/badge/Firebase-green?style=for-the-badge&logoColor=white&logo=nodejs&color=red"" alt="Nodejs" />
   <img src="https://img.shields.io/badge/Firebase-green?style=for-the-badge&logoColor=white&logo=mongodb&color=red"" alt="mongodb" /> 
 </div>
  <h3 align="center"> Task Manager App</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 📲 <a name="download-apk" href="https://drive.google.com/file/d/1tr2EDPdSyIJ-Ff2IrrLEyvesaWo1b-vB/view?usp=drive_link">[Download apk]</a>


## <a name="introduction">🤖 Introduction</a>
 <div>
<p>
Simple task management app for gig workers that allows users to create, update, delete, and view tasks. The app should have basic user authentication, local data storage, and an intuitive user interface.
</p>
   <img src="https://github.com/dev-vikash2v7/Task-Manager-App/blob/main/assets/1.jpg" height="400px"  align="center"/>
<img src="https://github.com/dev-vikash2v7/Task-Manager-App/blob/main/assets/taskmanager.jpg" height="400px"  align="center"/>
<img src="https://github.com/dev-vikash2v7/Task-Manager-App/blob/main/assets/2.jpg" height="400px"  align="center"/>

<img src="https://github.com/dev-vikash2v7/Task-Manager-App/blob/main/assets/4.jpg" height="400px"  align="center"/>

</div>

## <a name="tech-stack">⚙️ Tech Stack</a>

- React Native  - Framework
- Firebase  - Auth & Store 
- React Native Paper - UI
- Zustand  - State Management

## <a name="features">🔋 Features</a>

# Task Management:

1. Users should be able to create, edit, delete, and view tasks.

2. Each task should have the following fields: title, description, due date, and priority (low, medium, high).

3. Tasks  stored on firebase store.

4.  Provide the ability to filter tasks by priority and status (completed/incomplete).


## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:


## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **React Native development environment** (for mobile development)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)


## Backend Setup

### 1. Clone Backend
```bash
git clone https://github.com/dev-vikash2v7/taskmanager-backend.git
cd taskmanager-backend

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d


```

### 4. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `taskmanager`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`


# Application setup 



**Cloning the Repository**

```bash
git clone https://github.com/dev-vikash2v7/Task-Manager-App.git
cd Task-Manager-App
```
**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Running the Project**

```bash
npm run android

yarn run ios
```


