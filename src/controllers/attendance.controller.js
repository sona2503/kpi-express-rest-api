import * as attendanceService from '../services/attendance.service.js';

export async function index(req, res, next) {
  try {
    const { employeeId, tanggal } = req.query;
    const attendances = await attendanceService.getAllAttendances({ employeeId, tanggal });
    res.status(200).json({ data: attendances });
  } catch (err) {
    next(err);
  }
}

export async function show(req, res, next) {
  try {
    const attendance = await attendanceService.getAttendanceById(req.params.id);
    res.status(200).json({ data: attendance });
  } catch (err) {
    next(err);
  }
}

export async function checkIn(req, res, next) {
  try {
    const { employeeId, tanggal } = req.body;
    if (!employeeId || !tanggal) {
      return res.status(400).json({ message: 'employeeId dan tanggal wajib diisi' });
    }
    const attendance = await attendanceService.checkIn({ employeeId, tanggal });
    res.status(201).json({ message: 'Check-in berhasil', data: attendance });
  } catch (err) {
    next(err);
  }
}

export async function checkOut(req, res, next) {
  try {
    const attendance = await attendanceService.checkOut(req.params.id);
    res.status(200).json({ message: 'Check-out berhasil', data: attendance });
  } catch (err) {
    next(err);
  }
}

export async function store(req, res, next) {
  try {
    const { employeeId, tanggal, jamMasuk, jamKeluar, status, catatan } = req.body;
    if (!employeeId || !tanggal) {
      return res.status(400).json({ message: 'employeeId dan tanggal wajib diisi' });
    }

    const attendance = await attendanceService.createManualAttendance({
      employeeId: Number(employeeId),
      tanggal: new Date(tanggal),
      jamMasuk: jamMasuk ? new Date(jamMasuk) : null,
      jamKeluar: jamKeluar ? new Date(jamKeluar) : null,
      status,
      catatan,
    });

    res.status(201).json({ message: 'Presensi berhasil dicatat', data: attendance });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { status, catatan, jamMasuk, jamKeluar } = req.body;
    const attendance = await attendanceService.updateAttendance(req.params.id, {
      status, catatan,
      jamMasuk: jamMasuk ? new Date(jamMasuk) : undefined,
      jamKeluar: jamKeluar ? new Date(jamKeluar) : undefined,
    });
    res.status(200).json({ message: 'Presensi berhasil diperbarui', data: attendance });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await attendanceService.deleteAttendance(req.params.id);
    res.status(200).json({ message: 'Presensi berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}