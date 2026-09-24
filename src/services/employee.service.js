import prisma from '../config/db.js';

export async function getAllEmployees() {
  return prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEmployeeById(id) {
  const employee = await prisma.employee.findUnique({ where: { id: Number(id) } });
  if (!employee) {
    const error = new Error('Karyawan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return employee;
}

export async function createEmployee(data) {
  const existing = await prisma.employee.findUnique({ where: { nip: data.nip } });
  if (existing) {
    const error = new Error('NIP sudah terdaftar');
    error.statusCode = 409;
    throw error;
  }

  return prisma.employee.create({ data });
}

export async function updateEmployee(id, data) {
  await getEmployeeById(id); // memastikan ada, kalau tidak lempar 404
  return prisma.employee.update({ where: { id: Number(id) }, data });
}

export async function deleteEmployee(id) {
  await getEmployeeById(id);
  await prisma.employee.delete({ where: { id: Number(id) } });
}