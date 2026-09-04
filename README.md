# COMPTIA-Security-Practice-study-game
Interactive CompTIA Security+ SY0-701 study game with flashcards, quizzes, exams, survival mode, ports &amp; protocols, achievements, and study notes. 


# 🔐 CompTIA Security+ SY0-701 — Study Game

An interactive, browser-based study game designed to help students prepare for the **CompTIA Security+ SY0-701** certification exam.

The application combines cybersecurity revision with game-based learning through flashcards, quizzes, exams, challenges, achievements, and progress tracking.

## 🎯 Features

* 📚 **Flashcards** covering major Security+ concepts
* 📝 **Study Notes** for quick revision
* 🎯 **Match It** — interactive matching game
* ⚔️ **Boss Quiz** — challenging question rounds
* 🧪 **Domain Exams** based on the 5 Security+ exam domains
* 🔥 **Survival Mode** — keep answering correctly to survive
* ⚡ **Speed Round** for rapid revision
* 🔌 **Ports & Protocols** practice
* ❓ **True / False** questions
* ✍️ **Fill in the Blank** questions
* 🏆 **Achievements** and progress tracking
* ⭐ **XP and leveling system**
* 🔥 **Best streak tracking**
* 📊 **Session and performance statistics**
* 📖 **Reference notes** for cybersecurity concepts
* 💾 **Progress persistence** using browser localStorage
* 🛡️ **Fallback storage** when localStorage is unavailable
* ⚠️ **Visible JavaScript error handling** to prevent silent blank pages

## 📖 Security+ Coverage

The game is organized around the official **CompTIA Security+ SY0-701** exam domains:

1. **General Security**
2. **Threats & Vulnerabilities**
3. **Security Architecture**
4. **Security Operations**
5. **Governance, Risk & Compliance**

The study material is also organized into course modules covering topics such as:

* Introduction to Cybersecurity
* Networking
* Active Defense
* Attacks, Threats & Vulnerabilities
* Architecture & Design
* Cryptography
* Secure Solution Implementation
* Security Operations
* Governance, Compliance & Auditing
* Mixed Revision

## 🧠 Topics Covered

Examples of concepts included in the game:

* CIA Triad
* Confidentiality, Integrity and Availability
* Zero Trust
* Least Privilege
* Defense in Depth
* Authentication, Authorization & Accounting
* PKI
* Digital Certificates
* Certificate Authorities
* CRL and OCSP
* Symmetric & Asymmetric Encryption
* Hashing and Salting
* Digital Signatures
* ECC
* Perfect Forward Secrecy
* TPM and HSM
* Ransomware
* Rootkits
* Trojans
* Worms
* Keyloggers
* Phishing
* Spear Phishing
* Whaling
* Vishing & Smishing
* Business Email Compromise
* SQL Injection
* XSS
* Buffer Overflow
* Directory Traversal
* Zero-Day Vulnerabilities
* Supply Chain Attacks
* DDoS
* Password Spraying
* Credential Stuffing
* Networking and Security Protocols
* Ports and Protocols
* And many more

## 🛠️ Technologies

This project is intentionally lightweight and does not require a backend.

| Technology   | Purpose                                |
| ------------ | -------------------------------------- |
| HTML5        | Application structure                  |
| CSS3         | Interface and visual design            |
| JavaScript   | Game logic, questions and interactions |
| localStorage | Progress persistence                   |
| Git / GitHub | Version control and project hosting    |

## 📁 Project Structure

```text
comptia-security-plus-study-game/
│
├── index.html       # Main application page
├── style.css        # Application styling
├── script.js        # Game logic and study content
└── README.md        # Project documentation
```

## 🚀 Running the Project

### Option 1 — Open directly

Simply open:

```text
index.html
```

in a modern web browser.

The application includes a fallback mechanism for browsers that restrict `localStorage` when using `file://`.

However, running the application through a local web server is recommended.

### Option 2 — VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The application will open in your browser.

### Option 3 — Python HTTP Server

If Python is installed:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## 💾 Progress Tracking

The game uses browser `localStorage` to store information such as:

* XP
* Level
* Correct answers
* Best streak
* Sessions
* Achievements
* Mastered content
* Boss victories

If `localStorage` is unavailable, the application automatically falls back to temporary in-memory storage so the game remains functional.

## 🐛 Error Handling

The application includes a visible JavaScript error handler.

Instead of silently displaying a blank page when a JavaScript error occurs, the application displays an error message at the top of the interface.

For additional debugging, open the browser developer tools:

```text
F12 → Console
```

## 🎓 Purpose

This project was created as a **study and revision tool for cybersecurity students preparing for CompTIA Security+ SY0-701**.

It is designed to make memorization and revision more interactive by combining traditional study material with game mechanics such as:

* XP
* Levels
* Streaks
* Achievements
* Challenges
* Exams
* Boss battles

## ⚠️ Disclaimer

This project is an independent educational study tool and is **not affiliated with, sponsored by, or endorsed by CompTIA**.

CompTIA® and Security+® are trademarks of CompTIA, Inc.

The application should be used as a supplementary study resource and does not replace official CompTIA learning materials or exam preparation resources.

## 📌 Future Improvements

Possible future enhancements include:

* [ ] User accounts
* [ ] Cloud-based progress synchronization
* [ ] More practice questions
* [ ] Randomized question banks
* [ ] Difficulty levels
* [ ] Detailed performance analytics
* [ ] Mobile optimization
* [ ] Dark/light theme selection
* [ ] Sound effects and additional game animations
* [ ] Import/export of progress
* [ ] Multiplayer challenge mode
* [ ] PWA/mobile installation support

## 👨‍💻 Author

**Imad Abderrahmane Siakhene**

Developed as a cybersecurity learning project and interactive Security+ revision tool.

---

⭐ If you find this project useful, consider giving the repository a star!
