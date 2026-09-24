import * as behaviorService from '../services/behavior.service.js';

export async function index(req, res, next) {
  try {
    const { employeeId, periode } = req.query;
    const behaviors = await behaviorService.getAllBehaviors({ employeeId, periode });
    res.status(200).json({ data: behaviors });
  } catch (err) {
    next(err);
  }
}

export async function show(req, res, next) {
  try {
    const behavior = await behaviorService.getBehaviorById(req.params.id);
    res.status(200).json({ data: behavior });
  } catch (err) {
    next(err);
  }
}

export async function store(req, res, next) {
  try {
    const { employeeId, periode, rating, catatan, penilaiId } = req.body;
    if (!employeeId || !periode || !rating) {
      return res.status(400).json({ message: 'employeeId, periode, dan rating wajib diisi' });
    }
    const behavior = await behaviorService.createBehavior({ employeeId, periode, rating, catatan, penilaiId });
    res.status(201).json({ message: 'Penilaian perilaku berhasil ditambahkan', data: behavior });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { rating, catatan } = req.body;
    const behavior = await behaviorService.updateBehavior(req.params.id, { rating, catatan });
    res.status(200).json({ message: 'Penilaian perilaku berhasil diperbarui', data: behavior });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await behaviorService.deleteBehavior(req.params.id);
    res.status(200).json({ message: 'Penilaian perilaku berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}

export async function average(req, res, next) {
  try {
    const result = await behaviorService.getAverageScore(req.params.employeeId);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}