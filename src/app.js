import express from 'express';
import userRoutes from './routes/user.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import behaviorRoutes from './routes/behavior.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middlewares/error-handler.js';


const app = express();
app.use(express.json());



app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', userRoutes);
app.use('/api', employeeRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', behaviorRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

app.use(errorHandler);

export default app;