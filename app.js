const express = require('express');
const app = express();

app.use(express.json());

// ❌ Hardcoded secret (Vulnerability)
const SECRET_KEY = "SUPER_SECRET_KEY_123";

// ❌ Fake database (plain text passwords)
let users = [
    { username: "admin", password: "admin123" }
];

// ❌ Serve HTML directly (frontend inside backend)
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Vulnerable App</title>
        </head>
        <body>
            <h2>Vulnerable Test App</h2>

            <h3>XSS Test</h3>
            <input id="userInput" placeholder="Enter text">
            <button onclick="display()">Submit</button>
            <div id="output"></div>

            <h3>Login Test</h3>
            <input id="username" placeholder="Username">
            <input id="password" placeholder="Password" type="password">
            <button onclick="login()">Login</button>

            <script>
                // ❌ Vulnerability 1: XSS
                function display() {
                    const input = document.getElementById("userInput").value;
                    document.getElementById("output").innerHTML = input;
                }

                // ❌ Vulnerability 2: No input validation + insecure request
                async function login() {
                    const username = document.getElementById("username").value;
                    const password = document.getElementById("password").value;

                    const res = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });

                    const data = await res.text();
                    alert(data);
                }
            </script>
        </body>
        </html>
    `);
});

// ❌ Vulnerability 3: Weak authentication
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u =>
        u.username == username && u.password == password
    );

    if (user) {
        res.send("Login successful");
    } else {
        res.send("Invalid credentials");
    }
});

// ❌ Vulnerability 4: Exposing sensitive data
app.get('/data', (req, res) => {
    res.json({
        secret: SECRET_KEY
    });
});

// ❌ Vulnerability 5: No authorization check
app.get('/admin', (req, res) => {
    res.send("Welcome to Admin Panel (No Auth!)");
});

app.listen(3000, () => {
    console.log("🚨 Vulnerable app running at http://localhost:3000");
});