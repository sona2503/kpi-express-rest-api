import prisma from '../config/db.js';

export async function getAllProjects() {
  return prisma.project.findMany({
    include: { _count: { select: { members: true, tasks: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(id) {
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      members: { include: { employee: { select: { id: true, nama: true } } } },
      tasks: true,
    },
  });
  if (!project) {
    const error = new Error('Project tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return project;
}

export async function createProject(data) {
  return prisma.project.create({ data });
}

export async function updateProject(id, data) {
  await getProjectById(id);
  return prisma.project.update({ where: { id: Number(id) }, data });
}

export async function deleteProject(id) {
  await getProjectById(id);
  await prisma.project.delete({ where: { id: Number(id) } });
}