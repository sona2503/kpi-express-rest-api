import prisma from '../config/db.js';

export async function addMember(projectId, { employeeId, peran }) {
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_employeeId: { projectId: Number(projectId), employeeId: Number(employeeId) } },
  });
  if (existing) {
    const error = new Error('Karyawan sudah terdaftar di project ini');
    error.statusCode = 409;
    throw error;
  }

  return prisma.projectMember.create({
    data: { projectId: Number(projectId), employeeId: Number(employeeId), peran },
  });
}

export async function getMembers(projectId) {
  return prisma.projectMember.findMany({
    where: { projectId: Number(projectId) },
    include: { employee: { select: { id: true, nama: true, nip: true } } },
  });
}

export async function removeMember(projectId, employeeId) {
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_employeeId: { projectId: Number(projectId), employeeId: Number(employeeId) } },
  });
  if (!existing) {
    const error = new Error('Karyawan tidak terdaftar di project ini');
    error.statusCode = 404;
    throw error;
  }

  await prisma.projectMember.delete({
    where: { projectId_employeeId: { projectId: Number(projectId), employeeId: Number(employeeId) } },
  });
}