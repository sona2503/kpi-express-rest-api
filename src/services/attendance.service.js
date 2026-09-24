import prisma from '../config/db.js';

export async function getAllAttendances({ employeeId, tanggal } = {}) {
  return prisma.attendance.findMany({
    where: {
      ...(employeeId && { employeeId: Number(employeeId) }),
      ...(tanggal && { tanggal: new Date(tanggal) }),
    },
    include: { employee: { select: { id: true, nama: true, nip: true } } },
    orderBy: { tanggal: 'desc' },
  });
}

export async function getAttendanceById(id) {
  const attendance = await prisma.attendance.findUnique({
    where: { id: Number(id) },
    include: { employee: { select: { id: true, nama: true, nip: true } } },
  });
  if (!attendance) {
    const error = new Error('Data presensi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return attendance;
}

export async function checkIn({ employeeId, tanggal }) {
  const existing = await prisma.attendance.findUnique({
    where: { employeeId_tanggal: { employeeId: Number(employeeId), tanggal: new Date(tanggal) } },
  });
  if (existing) {
    const error = new Error('Presensi untuk tanggal ini sudah tercatat');
    error.statusCode = 409;
    throw error;
  }

  const now = new Date();
  const batasTelat = new Date(`${tanggal}T08:00:00`); // contoh: jam masuk normal 08:00

  return prisma.attendance.create({
    data: {
      employeeId: Number(employeeId),
      tanggal: new Date(tanggal),
      jamMasuk: now,
      status: now > batasTelat ? 'TELAT' : 'HADIR',
    },
  });
}

export async function checkOut(id) {
  const attendance = await getAttendanceById(id);
  if (attendance.jamKeluar) {
    const error = new Error('Jam keluar sudah tercatat sebelumnya');
    error.statusCode = 409;
    throw error;
  }

  return prisma.attendance.update({
    where: { id: Number(id) },
    data: { jamKeluar: new Date() },
  });
}

export async function createManualAttendance(data) {
  return prisma.attendance.create({ data });
}

export async function updateAttendance(id, data) {
  await getAttendanceById(id);
  return prisma.attendance.update({ where: { id: Number(id) }, data });
}

export async function deleteAttendance(id) {
  await getAttendanceById(id);
  await prisma.attendance.delete({ where: { id: Number(id) } });
}