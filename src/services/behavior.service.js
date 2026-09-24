import prisma from '../config/db.js';

// Pemetaan rating ke skor numerik — sangat baik = nilai tertinggi
const RATING_SCORE = {
  SANGAT_BAIK: 5,
  BAIK: 4,
  CUKUP: 3,
  KURANG: 2,
  SANGAT_KURANG: 1,
};

function withScore(behavior) {
  return { ...behavior, skor: RATING_SCORE[behavior.rating] };
}

export async function getAllBehaviors({ employeeId, periode } = {}) {
  const behaviors = await prisma.behavior.findMany({
    where: {
      ...(employeeId && { employeeId: Number(employeeId) }),
      ...(periode && { periode }),
    },
    include: { employee: { select: { id: true, nama: true, nip: true } } },
    orderBy: { periode: 'desc' },
  });
  return behaviors.map(withScore);
}

export async function getBehaviorById(id) {
  const behavior = await prisma.behavior.findUnique({
    where: { id: Number(id) },
    include: { employee: { select: { id: true, nama: true, nip: true } } },
  });
  if (!behavior) {
    const error = new Error('Data perilaku tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  return withScore(behavior);
}

export async function createBehavior({ employeeId, periode, rating, catatan, penilaiId }) {
  const existing = await prisma.behavior.findUnique({
    where: { employeeId_periode: { employeeId: Number(employeeId), periode } },
  });
  if (existing) {
    const error = new Error('Penilaian untuk periode ini sudah ada');
    error.statusCode = 409;
    throw error;
  }

  const behavior = await prisma.behavior.create({
    data: {
      employeeId: Number(employeeId),
      periode,
      rating,
      catatan,
      penilaiId: penilaiId ? Number(penilaiId) : null,
    },
  });
  return withScore(behavior);
}

export async function updateBehavior(id, { rating, catatan }) {
  await getBehaviorById(id);
  const behavior = await prisma.behavior.update({
    where: { id: Number(id) },
    data: { rating, catatan },
  });
  return withScore(behavior);
}

export async function deleteBehavior(id) {
  await getBehaviorById(id);
  await prisma.behavior.delete({ where: { id: Number(id) } });
}

export async function getAverageScore(employeeId) {
  const behaviors = await prisma.behavior.findMany({
    where: { employeeId: Number(employeeId) },
  });

  if (behaviors.length === 0) return { employeeId: Number(employeeId), rataRata: null, jumlahPenilaian: 0 };

  const total = behaviors.reduce((sum, b) => sum + RATING_SCORE[b.rating], 0);
  return {
    employeeId: Number(employeeId),
    rataRata: Number((total / behaviors.length).toFixed(2)),
    jumlahPenilaian: behaviors.length,
  };
}