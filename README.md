# 📘 Chapter Performance Dashboard - Backend API

A powerful and modular backend API built using **Node.js**, **Express**, **MongoDB**, and **Redis**. It allows secure management of chapter performance data including user authentication, admin-based chapter uploads, advanced filtering, Redis caching, and request rate limiting.


## 🌐 Live API

The live API is deployed and available here:  
🔗 [https://sleepy-sloth-backend-2217.onrender.com/api/v1](https://sleepy-sloth-backend-2217.onrender.com/api/v1/)


---

## 🚀 Features

-  User authentication with JWT & HttpOnly cookies  
-  Admin-based JSON file upload using Multer  
-  Automatic duplicate chapter detection and update  
-  Advanced query filtering (class, subject, unit, status, etc.)  
-  Pagination support  
-  Redis caching of chapter listings  
-  Redis-based rate limiting (30 reqs/min/IP)  
-  Graceful error handling and input validation  
-  Role-based access control (`user`, `admin`)  
-  Modular folder structure & clean codebase  



## 📦 Technologies Used

| Tech         | Purpose                          |
|--------------|----------------------------------|
| Node.js      | Backend runtime                  |
| Express.js   | Routing and middleware           |
| MongoDB      | Database                         |
| Mongoose     | MongoDB ODM                      |
| Redis        | Caching & Rate Limiting          |
| JWT          | Authentication                   |
| Cookies      | Secure session storage           |
| Multer       | File upload middleware           |
| dotenv       | Env configuration                |
| ioredis      | Redis client                     |
| bcryptjs     | Password hashing                 |


---

## 📚 API Documentation

### Auth Routes (`/api/v1/auth`)

- `POST /signup` – User sign up  
- `POST /login` – Login & get JWT cookie
- `POST /logout` – Logout & clear cookies  

### Chapter Routes (`/api/v1/chapters`)

- `POST /` – Upload JSON file (admin only)  
- `GET /` – Get all chapters with query, pagination, caching (protected route - needs login) 
- `GET /:id` – Get single chapter by ID (protected route - needs login) 

---

## 🔒 Auth Info

- JWT stored in **HttpOnly** cookies  
- `protect` middleware restricts routes  
- Admins must be added manually in DB  
- You can use example admin credentials for admin login and testing : 
### **Use this info to login as admin**
``` json
{
    "email" : "admin@gmail.com",
    "password" : "admin123"
}
```  

---

## 🧪 Sample Testing Flow

1. Sign up as user  
2. Login to receive JWT
3. Logout as user
4. Use example Admin credentials provided above to login as admin  
5. Upload chapter JSON file 
6. Fetch chapters via filters and pagination  
7. Exceed request limit to test rate limiter  
8. Recheck Redis cache effects  

---

## 🧠 Supported Filters

| Parameter       | Description                    |
|-----------------|--------------------------------|
| `class`         | Filter by class                |
| `subject`       | Filter by subject              |
| `unit`          | Filter by unit                 |
| `status`        | e.g. Completed, Not Started    |
| `weakChapters` | true or false                  |
| `page`          | Page number for pagination     |
| `limit`         | Items per page                 |

**Example:**  
`GET /api/v1/chapters?subject=Physics&class=Class 11&page=2&limit=5`

---

## 🧾 Upload Format

Upload a `.json` file containing an array of chapters:

```json
{
  "subject": "Physics",
  "chapter": "Kinematics",
  "class": "Class 11",
  "unit": "Mechanics 1",
  "yearWiseQuestionCount": {
    "2020": 1,
    "2021": 3
  },
  "questionSolved": 1,
  "status": "Not Started",
  "isWeakChapter": true
}
```

> Duplicate chapters (based on subject, class, chapter) will be **updated**.

---

## 💾 Redis Usage

- `GET /api/v1/chapters` is **cached** (key based on filters)  
- Cache **auto-invalidated** on file upload  
- Redis also stores IP request counts for rate limiting  

---

## 🚦 Rate Limiting

- 30 requests/minute per IP  
- Redis used to track and expire requests  
- Returns `Retry-After`, `X-RateLimit-Remaining` headers  

---

## 📂 Environment Variables (`.env`)

```
PORT=port number
MONGO_URI=your_mongodb_uri
DATABASE = your_database_name
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
```

---

## 📤 Deployment

- Deployed on: `Render` 
- Auto-deploy via connected GitHub repository  

---

## 🧪 Postman Collection

[Go to Postman Collection](https://justme-6811.postman.co/workspace/JustMe-Workspace~e4a6a401-1c7d-4d9d-90f9-d915a0567b59/collection/37304514-57052357-8267-4ed9-856a-7abd7bcd1aac?action=share&creator=37304514)


Sample files required for testing the APIs are available here  :  [View Sample Files](https://github.com/ravimani1001/sleepy-sloth-backend-2217/tree/main/test)

- Public and documented  
- Includes:
  - Auth routes  
  - File upload  
  - Chapter queries with filters & pagination  
  - Rate-limit test cases 

  


---

## 🏁 Getting Started

```bash
git clone https://github.com/ravimani1001/sleepy-sloth-backend-2217.git

cd project-folder

npm install

touch .env

# Add your environment variables
npm run dev
```

---


## 🙌 Thanks

Built by **Ravi Mani**.

### 🔗 Connect with Me

- 💼 [GitHub](https://github.com/ravimani1001)
- 🧑‍💻 [Upwork Profile](https://www.upwork.com/freelancers/~0141d0989fe0897c4d)
- 🌐 [LinkedIn](https://linkedin.com/in/ravimani17)


Feel free to fork and enhance it further.