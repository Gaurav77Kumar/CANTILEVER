import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);
const statuses = ['todo', 'in-progress', 'completed'];
const priorities = ['low', 'medium', 'high'];
function taskInput(body, partial = false) {
  const data = {};
  if (!partial || Object.hasOwn(body, 'title')) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 160) throw new Error('Title must be between 1 and 160 characters.');
    data.title = body.title.trim();
  }
  if (Object.hasOwn(body, 'description')) {
    if (typeof body.description !== 'string' || body.description.length > 4000) throw new Error('Description must be no more than 4000 characters.');
    data.description = body.description;
  }
  for (const [field, values] of [['status', statuses], ['priority', priorities]]) {
    if (Object.hasOwn(body, field)) {
      if (!values.includes(body[field])) throw new Error(`Invalid ${field}.`);
      data[field] = body[field];
    }
  }
  if (Object.hasOwn(body, 'dueDate')) {
    if (body.dueDate === null || body.dueDate === '') data.dueDate = null;
    else {
      const value = body.dueDate;
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error('Enter a valid due date.');
      data.dueDate = new Date(value);
    }
  }
  if (partial && !Object.keys(data).length) throw new Error('No task fields supplied.');
  return data;
}
router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    for (const [field, values] of [['status', statuses], ['priority', priorities]]) {
      if (req.query[field]) {
        if (!values.includes(req.query[field])) return res.status(400).json({ message: `Invalid ${field} filter.` });
        filter[field] = req.query[field];
      }
    }
    const sorts = { newest: { createdAt: -1, _id: -1 }, oldest: { createdAt: 1, _id: 1 }, title: { title: 1, _id: 1 } };
    const sort = req.query.sort || 'newest';
    if (!Object.hasOwn(sorts, sort)) return res.status(400).json({ message: 'Invalid sort option.' });
    const page = Number(req.query.page || 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000) return res.status(400).json({ message: 'Invalid page.' });
    const limit = 20;
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sorts[sort]).skip((page - 1) * limit).limit(limit),
      Task.countDocuments(filter),
    ]);
    res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  let data;
  try { data = taskInput(req.body); }
  catch (error) { return res.status(400).json({ message: error.message }); }
  try { res.status(201).json(await Task.create({ ...data, userId: req.user._id })); }
  catch (error) { next(error); }
});
router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({ message: 'Invalid task ID.' });
  next();
});
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  let data;
  try { data = taskInput(req.body, true); }
  catch (error) { return res.status(400).json({ message: error.message }); }
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { $set: data }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
});
export default router;
