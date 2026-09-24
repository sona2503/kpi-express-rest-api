// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';

export async function store(req, res, next) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' });
    }

    const user = await userService.createUser({ username, password, role });
    res.status(201).json({ message: 'User berhasil dibuat', data: user });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'username dan password wajib diisi' });
    }

    const result = await userService.login({ username, password });
    res.status(200).json({ message: 'Login berhasil', ...result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    // JWT bersifat stateless: server tidak menyimpan sesi,
    // jadi "logout" secara efektif dilakukan client dengan membuang token.
    res.status(200).json({ message: 'Logout berhasil' });
  } catch (err) {
    next(err);
  }
}