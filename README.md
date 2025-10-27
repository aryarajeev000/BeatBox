# 🎵 BeatBox - Music Streaming Backend API

BeatBox is a Node.js + Express + MongoDB based backend API for managing and streaming songs with authentication & file uploads (image + audio).
It supports song upload, playback (audio streaming), user registration/login, and featured songs.

🚀 Tech Stack
Technology	Purpose
Node.js	Server runtime
Express.js	Backend Framework
MongoDB + Mongoose	Database
Multer	File Uploads (image/audio)
JWT	Authentication
Bcrypt	Password Encryption
✅ Features

✔ User registration & login
✔ Password hashing
✔ Song upload with image & audio
✔ Audio streaming endpoint
✔ Featured song support
✔ Validations (file type / size / missing fields)
✔ Environment variables support (.env)

📁 Project Structure
/Rajeev_backend
   |-- controllers/
   |-- middlewares/
   |-- models/
   |-- routes/
   |-- uploads/
   |-- .env
   |-- server.js
   |-- README.md

⚙️ Installation & Setup
# Clone repository
git clone https://github.com/aryarajeev000/BeatBox.git

# Navigate
cd BeatBox

# Install dependencies
npm install

🔐 Environment Variables

Create a .env file in root and add:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/beatbox_db
JWT_SECRET=your_secret_key_here

▶️ Run Project
npm run dev


Server will start on:

http://localhost:5000

🧑‍💻 API Endpoints
🔐 Auth
Method	Endpoint	Description
POST	/api/auth/register	Register User
POST	/api/auth/login	Login User
🎵 Songs
Method	Endpoint	Description
POST	/api/songs	Upload Song (image+audio)
GET	/api/songs	Get all songs
GET	/api/songs/:id	Get song by id
GET	/api/songs/stream/:id	Stream audio
GET	/api/songs/featured	Get featured song
PUT	/api/songs/:id	Update song
DELETE	/api/songs/:id	Delete song
📤 Upload Fields (form-data)
Key	Type	Required
songName	text	✅
description	text	✅
action	text (play or pause)	✅
songImage	file (jpg/png)	✅
audioFile	file (mp3)	✅
▶️ Streaming Example
<audio controls>
  <source src="http://localhost:5000/api/songs/stream/SONG_ID" type="audio/mpeg" />
</audio>
