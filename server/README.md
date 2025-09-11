# SecretBox  

SecretBox is a **secure backend application** for sharing anonymous messages, inspired by the *Sarahah* concept.  
It was built during my Node.js course as my **first complete backend project**, focusing on authentication, authorization, and secure message handling.  

---

## 🚀 Features  

- **Authentication & Authorization:** User SignUp, Login, Logout, Google OAuth, Refresh Tokens, Password Management, Role-based Middleware.  
- **User Accounts & Profiles:** Manage profile info, upload profile & cover images, freeze/restore/delete accounts, share profile, search for users.  
- **Anonymous Messaging:** Send & receive anonymous messages, reply anonymously, manage inbox & sent messages securely.  

---

## 🛠️ Tech Stack  
- Node.js, Express.js  
- MongoDB (Mongoose)  
- JWT & Google OAuth 2.0  
- Multer / Cloud storage  
- Middleware architecture  

---

## 📚 What I Learned  
- Building a secure and scalable backend  
- Implementing authentication flows  
- Managing databases with clean architecture  
- Professional backend project structure  

---

## 🔮 Future Improvements  
- Notifications system  
- UI/UX frontend  
- Performance optimization  
- Unit & integration testing  

---

## 📦 Installation & Setup  

```bash
# Clone the repository
git clone https://github.com/your-username/SecretBox.git
cd SecretBox

# Install dependencies
npm install

# Create .env file and add:
DB_URI=
ENCRYPTKEY=
SALTROUND=
ACCESS_USER_TOKEN_SIGNATURE=
REFRESH_USER_TOKEN_SIGNATURE=
ACCESS_SYSTEM_TOKEN_SIGNATURE=
REFRESH_SYSTEM_TOKEN_SIGNATURE=
EMAIL=
PASSWORD=
APP_EMAIL=
APP_PASSWORD=
WEB_CLIENT_IDS=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
APP_Name=
DOCUMENTATION_URL=

# Run the server
npm run dev

```

📖 API Documentation :  for detailed API endpoints

https://documenter.getpostman.com/view/40056651/2sB34kDJkc
