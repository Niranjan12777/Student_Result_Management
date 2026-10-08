const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// @route   GET /api/students
// @desc    Get all students for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students
// @desc    Create a new student
// @access  Private
router.post(
  '/',
  [
    auth,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('rollNo').notEmpty().withMessage('Roll number is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('marks').isNumeric().withMessage('Marks must be a number'),
    body('grade').notEmpty().withMessage('Grade is required')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, rollNo, course, marks, grade, subjects } = req.body;

      // Create new student
      const student = new Student({
        name,
        email,
        rollNo,
        course,
        marks,
        grade,
        subjects: subjects || [],
        createdBy: req.user.userId
      });

      await student.save();

      res.status(201).json({
        success: true,
        message: 'Student added successfully',
        student
      });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, rollNo, course, marks, grade, subjects } = req.body;

    // Find student
    let student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student
    student.name = name || student.name;
    student.email = email || student.email;
    student.rollNo = rollNo || student.rollNo;
    student.course = course || student.course;
    student.marks = marks !== undefined ? marks : student.marks;
    student.grade = grade || student.grade;
    student.subjects = subjects || student.subjects;
    student.updatedAt = Date.now();

    await student.save();

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;