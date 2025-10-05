"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- Optimized Endpoint using Worker Threads ---
app.post('/api/process-data', async (req, res) => {
    console.log('Received request on main thread (optimized)');
    const { data } = req.body;
    try {
        // Create a new worker for each request (for simplicity in this example)
        // In a real application, you might use a worker pool for better performance
        const worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, 'worker.js'), {
            workerData: { inputData: req.body },
        });
        worker.on('message', (result) => {
            console.log('Worker thread sent message back to main thread.');
            res.json(result);
        });
        worker.on('error', (err) => {
            console.error('Worker thread error:', err);
            res.status(500).json({ error: 'Worker thread error processing data.' });
        });
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
    }
    catch (error) {
        console.error('Failed to spawn worker:', error);
        res.status(500).json({ error: 'Failed to offload task to worker.' });
    }
});
app.get('/', (req, res) => {
    res.send('Backend is running (optimized)!');
});
app.listen(port, () => {
    console.log(`Optimized server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app-optimized.js.map