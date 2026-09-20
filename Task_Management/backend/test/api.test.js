import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

let database;
let token;
let taskId;
const account = { name: 'Test User', email: 'test@example.com', password: 'Testing123!' };
before(async () => {
  process.env.JWT_SECRET = randomBytes(48).toString('hex');
  database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri());
  await User.init();
});
after(async () => { await mongoose.disconnect(); await database?.stop(); });

test('register, login, create and retrieve a task', async () => {
  const registered = await request(app).post('/api/auth/register').send(account).expect(201);
  assert.equal(registered.body.user.name, account.name);
  assert.equal(registered.body.user.password, undefined);
  const login = await request(app).post('/api/auth/login').send(account).expect(200);
  token = login.body.token;
  const task = await request(app).post('/api/tasks').auth(token, { type: 'bearer' }).send({ title: 'First task', priority: 'high', dueDate: '2026-12-31' }).expect(201);
  taskId = task.body._id;
  const list = await request(app).get('/api/tasks').auth(token, { type: 'bearer' }).expect(200);
  assert.equal(list.body.tasks[0].title, 'First task');
  const read = await request(app).get(`/api/tasks/${taskId}`).auth(token, { type: 'bearer' }).expect(200);
  assert.equal(read.body._id, taskId);
});
test('authentication and validation', async () => {
  await request(app).get('/api/tasks').expect(401);
  await request(app).post('/api/auth/register').send(account).expect(409);
  await request(app).post('/api/auth/login').send({ ...account, password: 'incorrect-password' }).expect(401);
  await request(app).post('/api/tasks').auth(token, { type: 'bearer' }).send({ title: '  ' }).expect(400);
  await request(app).post('/api/tasks').auth(token, { type: 'bearer' }).send({ title: 'Bad date', dueDate: '2026-02-31' }).expect(400);
});
test('update, filtering, sorting and ownership isolation', async () => {
  const edited = await request(app).patch(`/api/tasks/${taskId}`).auth(token, { type: 'bearer' }).send({ status: 'completed' }).expect(200);
  assert.equal(edited.body.status, 'completed');
  const filtered = await request(app).get('/api/tasks?status=completed&priority=high&sort=title').auth(token, { type: 'bearer' }).expect(200);
  assert.equal(filtered.body.total, 1);
  const empty = await request(app).get('/api/tasks?status=todo').auth(token, { type: 'bearer' }).expect(200);
  assert.equal(empty.body.total, 0);
  const other = await request(app).post('/api/auth/register').send({ ...account, email: 'other@example.com' }).expect(201);
  for (const method of ['get', 'patch', 'delete']) {
    const call = request(app)[method](`/api/tasks/${taskId}`).auth(other.body.token, { type: 'bearer' });
    if (method === 'patch') call.send({ title: 'Not yours' });
    await call.expect(404);
  }
  const otherList = await request(app).get('/api/tasks').auth(other.body.token, { type: 'bearer' }).expect(200);
  assert.equal(otherList.body.total, 0);
});
test('delete task', async () => {
  await request(app).delete(`/api/tasks/${taskId}`).auth(token, { type: 'bearer' }).expect(204);
  await request(app).get(`/api/tasks/${taskId}`).auth(token, { type: 'bearer' }).expect(404);
});
