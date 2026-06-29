🔗 URL Shortener

A secure and scalable URL Shortener web application built using Java, Spring Boot, Spring Security, JWT Authentication, React, and MySQL. The application enables users to register, log in securely, create shortened URLs, manage their links, and track URL usage through an intuitive dashboard.

🚀 Features
🔐 User Registration and Login using JWT Authentication
🔒 Secure REST APIs with Spring Security
✂️ Generate unique short URLs from long URLs
🌐 Redirect short URLs to their original destinations
📋 View and manage all created URLs
🗑️ Delete previously generated URLs
📱 Responsive and user-friendly interface
💾 Store URL data securely in MySQL
⚡ Fast URL redirection
🛡️ Password encryption using BCrypt
🛠️ Tech Stack
Backend
Java 21
Spring Boot
Spring Security
Spring Data JPA
JWT Authentication
Hibernate
Maven
Frontend
React
HTML5
CSS3
JavaScript
Axios
Database
MySQL
Tools
IntelliJ IDEA
VS Code
Postman
Git & GitHub
📂 Project Structure
url-shortener/
│── backend/
│   ├── src/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── security/
│   └── model/
│
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
⚙️ Installation
Clone the Repository
git clone https://github.com/sarthak425/url-shortener.git
cd url-shortener
Backend
cd backend

Configure your application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener
spring.datasource.username=root
spring.datasource.password=your_password

Run the Spring Boot application:

mvn spring-boot:run
Frontend
cd frontend
npm install
npm run dev
🔐 Authentication Flow
User Registration
User Login
JWT Token Generation
Protected API Access
Secure URL Management
📸 Screenshots

Add screenshots of:

Login Page
Register Page
Dashboard
URL Creation
URL List
URL Redirection
📈 Future Improvements
QR Code generation for shortened URLs
Click analytics dashboard
URL expiration
Custom aliases
User profile management
Dark mode
Docker deployment
Cloud deployment (AWS, Render, Railway)
🤝 Contributing

Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a pull request.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Sarthak Khatpe

GitHub: https://github.com/sarthak425
LinkedIn: https://www.linkedin.com/in/sarthak-khatpe-943911327/
