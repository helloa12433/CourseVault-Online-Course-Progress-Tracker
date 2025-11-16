const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  const payload = { ...req.body, user: req.user._id };
  const course = await Course.create(payload);
  res.status(201).json(course);
};

exports.getCourses = async (req, res) => {
  const q = { user: req.user._id };
  if (req.query.status) q.status = req.query.status;
  if (req.query.category) q.category = req.query.category;
  if (req.query.search) q.title = { $regex: req.query.search, $options: 'i' };
  const courses = await Course.find(q).sort({ createdAt: -1 });
  res.json(courses);
};

exports.getCourse = async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, user: req.user._id });
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json(course);
};

exports.updateCourse = async (req, res) => {
  const upd = await Course.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!upd) return res.status(404).json({ message: 'Not found' });
  res.json(upd);
};

exports.deleteCourse = async (req, res) => {
  const del = await Course.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
exports.getCourseById = async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, user: req.user._id })
  if (!course) return res.status(404).json({ message: 'Course not found' })
  res.json(course)
}

exports.updateProgress = async (req, res) => {
  const { progress } = req.body;
  if (progress == null) return res.status(400).json({ message: 'Missing progress' });
  const upd = await Course.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { progress: Math.max(0, Math.min(100, Number(progress))) },
    { new: true }
  );
  if (!upd) return res.status(404).json({ message: 'Not found' });
  res.json(upd);
};
