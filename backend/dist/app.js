"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- CPU-Intensive, Synchronous Functions ---
// A complex mathematical loop (Fibonacci for deep recursion)
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}
// A function to simulate massive JSON parsing
function parseLargeJson(data) {
    // Create a very large object by duplicating the input many times
    let largeObject = {};
    for (let i = 0; i < 1000; i++) { // Adjust this number for more or less intensity
        largeObject[`key_${i}`] = { ...data, timestamp: Date.now() + i };
    }
    // Stringify and parse to simulate real JSON processing overhead
    return JSON.parse(JSON.stringify(largeObject));
}
// --- Unoptimized Endpoint ---
app.post('/api/process-data', (req, res) => {
    console.log('Received request on main thread (unoptimized)');
    const { data } = req.body;
    // Simulate massive JSON data processing
    const processedJson = parseLargeJson(data);
    // Perform CPU-intensive calculation
    // A large number like 40-42 for Fibonacci will block significantly
    const fibResult = fibonacci(40);
    res.json({
        message: 'Data processed (unoptimized)',
        originalData: data,
        fibonacciResult: fibResult,
        processedJsonKeys: Object.keys(processedJson).length,
        timestamp: new Date().toISOString(),
    });
});
app.get('/', (req, res) => {
    res.send('Backend is running!');
});
app.listen(port, () => {
    console.log(`Unoptimized server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map