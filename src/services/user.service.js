// src/services/user.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const SALT_ROUNDS = 10;

export async function createUser({ username, password, role }) {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    const error = new Error('Username sudah dipakai');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: { username, passwordHash, role },
    select: { id: true, username: true, role: true, isActive: true, createdAt: true },
  });
}

export async function deleteUser(id) {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) {
    const error = new Error('User tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({ where: { id: Number(id) } });
}

export async function login({ username, password }) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.isActive) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return {
    token,
    user: { id: user.id, username: user.username, role: user.role },
  };
}