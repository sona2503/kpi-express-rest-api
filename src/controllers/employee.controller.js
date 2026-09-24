import * as employeeService from '../services/employee.service.js';

export async function index(req, res, next) {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json({ data: employees });
  } catch (err) {
    next(err);
  }
}

export async function show(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.status(200).json({ data: employee });
  } catch (err) {
    next(err);
  }
}

export async function store(req, res, next) {
  try {
    const { nip, nama, email, department, position, tanggalMasuk } = req.body;

    if (!nip || !nama || !tanggalMasuk) {
      return res.status(400).json({ message: 'nip, nama, dan tanggalMasuk wajib diisi' });
    }

    const employee = await employeeService.createEmployee({
      nip, nama, email, department, position,
      tanggalMasuk: new Date(tanggalMasuk),
    });

    res.status(201).json({ message: 'Karyawan berhasil ditambahkan', data: employee });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { nama, email, department, position, status } = req.body;
    const employee = await employeeService.updateEmployee(req.params.id, {
      nama, email, department, position, status,
    });
    res.status(200).json({ message: 'Karyawan berhasil diperbarui', data: employee });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await employeeService.deleteEmployee(req.params.id);
    res.status(200).json({ message: 'Karyawan berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}