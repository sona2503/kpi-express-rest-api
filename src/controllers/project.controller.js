import * as projectService from '../services/project.service.js';
import * as memberService from '../services/project-member.service.js';

export async function index(req, res, next) {
  try {
    res.status(200).json({ data: await projectService.getAllProjects() });
  } catch (err) { next(err); }
}

export async function show(req, res, next) {
  try {
    res.status(200).json({ data: await projectService.getProjectById(req.params.id) });
  } catch (err) { next(err); }
}

export async function store(req, res, next) {
  try {
    const { nama, deskripsi, startDate, deadline, managerId } = req.body;
    if (!nama || !startDate) {
      return res.status(400).json({ message: 'nama dan startDate wajib diisi' });
    }
    const project = await projectService.createProject({
      nama, deskripsi,
      startDate: new Date(startDate),
      deadline: deadline ? new Date(deadline) : null,
      managerId: managerId ? Number(managerId) : null,
    });
    res.status(201).json({ message: 'Project berhasil dibuat', data: project });
  } catch (err) { next(err); }
}

export async function update(req, res, next) {
  try {
    const { nama, deskripsi, deadline, status, managerId } = req.body;
    const project = await projectService.updateProject(req.params.id, {
      nama, deskripsi, status,
      deadline: deadline ? new Date(deadline) : undefined,
      managerId: managerId ? Number(managerId) : undefined,
    });
    res.status(200).json({ message: 'Project berhasil diperbarui', data: project });
  } catch (err) { next(err); }
}

export async function destroy(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(200).json({ message: 'Project berhasil dihapus' });
  } catch (err) { next(err); }
}

export async function addMember(req, res, next) {
  try {
    const { employeeId, peran } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'employeeId wajib diisi' });
    const member = await memberService.addMember(req.params.id, { employeeId, peran });
    res.status(201).json({ message: 'Anggota berhasil ditambahkan', data: member });
  } catch (err) { next(err); }
}

export async function listMembers(req, res, next) {
  try {
    res.status(200).json({ data: await memberService.getMembers(req.params.id) });
  } catch (err) { next(err); }
}

export async function removeMember(req, res, next) {
  try {
    await memberService.removeMember(req.params.id, req.params.employeeId);
    res.status(200).json({ message: 'Anggota berhasil dikeluarkan' });
  } catch (err) { next(err); }
}