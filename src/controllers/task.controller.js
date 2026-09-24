import * as taskService from '../services/task.service.js';

export async function index(req, res, next) {
  try {
    const { projectId, assigneeId, status } = req.query;
    res.status(200).json({ data: await taskService.getAllTasks({ projectId, assigneeId, status }) });
  } catch (err) { next(err); }
}

export async function show(req, res, next) {
  try {
    res.status(200).json({ data: await taskService.getTaskById(req.params.id) });
  } catch (err) { next(err); }
}

export async function store(req, res, next) {
  try {
    const { projectId, judul, deskripsi, assigneeId, prioritas, estimasiJam, dueDate } = req.body;
    if (!projectId || !judul) {
      return res.status(400).json({ message: 'projectId dan judul wajib diisi' });
    }
    const task = await taskService.createTask({
      projectId: Number(projectId),
      judul, deskripsi,
      assigneeId: assigneeId ? Number(assigneeId) : null,
      prioritas,
      estimasiJam: estimasiJam ? Number(estimasiJam) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
    res.status(201).json({ message: 'Task berhasil dibuat', data: task });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const { judul, deskripsi, assigneeId, prioritas, status, estimasiJam, dueDate } = req.body;
    const task = await taskService.updateTask(req.params.id, {
      judul, deskripsi, prioritas, status,
      assigneeId: assigneeId ? Number(assigneeId) : undefined,
      estimasiJam: estimasiJam ? Number(estimasiJam) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    res.status(200).json({ message: 'Task berhasil diperbarui', data: task });
  } catch (err) { next(err); }
}

export async function start(req, res, next) {
  try {
    res.status(200).json({ message: 'Task dimulai', data: await taskService.startTask(req.params.id) });
  } catch (err) { next(err); }
}

export async function complete(req, res, next) {
  try {
    res.status(200).json({ message: 'Task selesai', data: await taskService.completeTask(req.params.id) });
  } catch (err) { next(err); }
}

export async function destroy(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ message: 'Task berhasil dihapus' });
  } catch (err) { next(err); }
}