# 🔗 URL Shortener

A secure and scalable **URL Shortener** web application built using **Java, Spring Boot, Spring Security, JWT Authentication, React, and MySQL**. The application allows users to securely register and log in, generate shortened URLs, manage their links, and redirect users to the original URLs. It follows a full-stack architecture with a RESTful backend and a responsive React frontend.

---

## 🚀 Features

* Secure user registration and login with JWT Authentication
* Password encryption using BCrypt
* Create unique short URLs from long URLs
* Redirect shortened URLs to their original destinations
* View and manage previously created URLs
* Delete unwanted URLs
* Responsive user interface built with React
* RESTful APIs developed using Spring Boot
* MySQL database integration using Spring Data JPA

---

## 🛠️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT (JJWT)
* Maven

### Frontend

* React
* HTML5
* CSS3
* JavaScript
* Axios

### Database

* MySQL

### Tools

* IntelliJ IDEA
* Visual Studio Code
* Postman
* Git & GitHub

---

## 📂 Project Structure

```text
url-shortener/
├── backend/
│   ├── src/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── security/
│   └── model/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/sarthak425/url-shortener.git
cd url-shortener
```

### Backend Setup

```bash
cd backend
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener
spring.datasource.username=root
spring.datasource.password=your_password
```

Run the backend:

```bash
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User Registration
* User Login
* JWT Token Generation
* Protected REST APIs
* Secure URL Management

---

## 📸 Screenshots

Add screenshots of the following pages:

* Login Page
* Registration Page
* Dashboard
* URL Creation
* URL Management
* URL Redirection

---

## 🚀 Future Enhancements

* QR Code generation for shortened URLs
* Click analytics dashboard
* Custom short URL aliases
* URL expiration feature
* User profile management
* Dark mode support
* Docker containerization
* Cloud deployment (AWS, Render, Railway)

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork this repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sarthak Khatpe**

* GitHub: https://github.com/sarthak425
* LinkedIn: https://www.linkedin.com/in/sarthak-khatpe-943911327/

If you found this project helpful, please consider giving it a ⭐ on GitHub.
