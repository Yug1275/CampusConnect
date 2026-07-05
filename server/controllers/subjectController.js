const Subject = require("../models/Subject");

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = async (req, res, next) => {
  try {
    const { name, code, department, semester, faculty } = req.body;

    if (!name || !code || !department || !semester) {
      res.status(400);
      throw new Error("Name, code, department, and semester are required");
    }

    const existing = await Subject.findOne({ department, code: code.toUpperCase() });
    if (existing) {
      res.status(400);
      throw new Error("A subject with this code already exists in this department");
    }

    const subject = await Subject.create({
      name,
      code,
      department,
      semester,
      faculty: faculty || null,
    });

    const populated = await subject.populate([
      { path: "department", select: "name code" },
      { path: "faculty", select: "name email" },
    ]);

    res.status(201).json({ success: true, subject: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subjects, optionally filtered by department/faculty/semester
// @route   GET /api/subjects?department=&faculty=&semester=
// @access  Private (any authenticated user)
const getSubjects = async (req, res, next) => {
  try {
    const { department, faculty, semester } = req.query;

    const query = {};
    if (department) query.department = department;
    if (faculty) query.faculty = faculty;
    if (semester) query.semester = semester;

    const subjects = await Subject.find(query)
      .populate("department", "name code")
      .populate("faculty", "name email")
      .sort({ semester: 1, name: 1 });

    res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single subject by ID
// @route   GET /api/subjects/:id
// @access  Private (any authenticated user)
const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("department", "name code")
      .populate("faculty", "name email");

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    res.status(200).json({ success: true, subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    const { name, code, department, semester, faculty } = req.body;

    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (department !== undefined) subject.department = department;
    if (semester !== undefined) subject.semester = semester;
    if (faculty !== undefined) subject.faculty = faculty || null;

    const updated = await subject.save();
    const populated = await updated.populate([
      { path: "department", select: "name code" },
      { path: "faculty", select: "name email" },
    ]);

    res.status(200).json({ success: true, message: "Subject updated successfully", subject: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    await subject.deleteOne();

    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};