import prisma from '../config/db.js';

function withDuration(task) {
  let durasiJam = null;
  if (task.startedAt && task.completedAt) {
    durasiJam = Number(((task.completedAt - task.startedAt) / (1000 * 60 * 60)).toFixed(2));
  }
  const terlambat = task.completedAt && task.dueDate ? task.completedAt > task.dueDate : null;
  return { ...task, durasiJam, terlambat };
}

export async function getAllTasks({ projectId, assigneeId, status } = {}) {
  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId && { projectId: Number(projectId) }),
      ...(assigneeId && { assigneeId: Number(assigneeId) }),
      ...(status && { status }),
    },
    include: { assignee: { select: { id: true, nama: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return tasks.map(withDuration);
}

export async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
    include: { assignee: { select: { id: true, nama: true } } },
  });
  if (!task) {
    const error = new Error('Task tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return withDuration(task);
}

export async function createTask(data) {
  const task = await prisma.task.create({ data });
  return withDuration(task);
}

export async function updateTask(id, data) {
  await getTaskById(id);
  const task = await prisma.task.update({ where: { id: Number(id) }, data });
  return withDuration(task);
}

export async function startTask(id) {
  await getTaskById(id);
  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
  });
  return withDuration(task);
}

export async function completeTask(id) {
  await getTaskById(id);
  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: { status: 'DONE', completedAt: new Date() },
  });
  return withDuration(task);
}

export async function deleteTask(id) {
  await getTaskById(id);
  await prisma.task.delete({ where: { id: Number(id) } });
}