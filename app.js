const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ❌ Hardcoded config (real-world mistake)
const CONFIG = {
    DB_PASSWORD: "root123",
    API_KEY: "sk-live-123456",
    JWT_SECRET: "mysecret"
};

// ❌ Fake DB (simulating SQL-like queries)
let users = [
    { id: 1, username: "admin", password: "admin123", role: "admin" },
    { id: 2, username: "user", password: "user123", role: "user" }
];

// ❌ Serve frontend
app.get('/', (req, res) => {
    res.send(`
        <html>
        <body>
            <h1>Enterprise Dashboard</h1>

            <h3>Search User</h3>
            <form method="GET" action="/search">
                <input name="q" placeholder="Search username">
                <button type="submit">Search</button>
            </form>

            <h3>Feedback</h3>
            <input id="msg" placeholder="Enter message">
            <button onclick="send()">Submit</button>
            <div id="output"></div>

            <script>
                // ❌ Stored/Reflected XSS
                function send() {
                    const msg = document.getElementById("msg").value;
                    document.getElementById("output").innerHTML = msg;
                }
            </script>
        </body>
        </html>
    `);
});

// ❌ Injection-like vulnerability (simulated SQL query)
app.get('/search', (req, res) => {
    const q = req.query.q;

    // ❌ No sanitization (simulating SQL injection style logic)
    const result = users.filter(u => u.username.includes(q));

    res.send(`
        <h2>Results</h2>
        ${result.map(u => `<p>${u.username}</p>`).join("")}
    `);
});

// ❌ Weak login (real-world mistake)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // ❌ == instead of strict check + no hashing
    const user = users.find(u =>
        u.username == username && u.password == password
    );

    if (user) {
        res.json({
            message: "Login success",
            user: user
        });
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// ❌ Sensitive data exposure
app.get('/config', (req, res) => {
    res.json(CONFIG);
});

// ❌ Broken authorization (IDOR-like issue)
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);

    // ❌ No auth check
    if (user) {
        res.json(user);
    } else {
        res.status(404).send("User not found");
    }
});

// ❌ Admin panel without auth
app.get('/admin', (req, res) => {
    res.send("<h1>Admin Panel - No Authentication</h1>");
});

app.listen(3000, () => {
    console.log("🚨 Test app running at http://localhost:3000");
});