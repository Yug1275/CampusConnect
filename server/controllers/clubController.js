const Club = require("../models/Club");
const ClubMembership = require("../models/ClubMembership");

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Private/Admin
const createClub = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Club name is required");
    }

    const existing = await Club.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error("A club with this name already exists");
    }

    const club = await Club.create({
      name,
      description,
      category: category || "Other",
      createdBy: req.user._id,
    });

    const populated = await club.populate("createdBy", "name email");

    res.status(201).json({ success: true, club: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clubs, optionally filtered by category.
//          Each club includes memberCount and, for the logged-in user, isMember.
// @route   GET /api/clubs?category=
// @access  Private (any authenticated user)
const getClubs = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = {};
    if (category) query.category = category;

    const clubs = await Club.find(query)
      .populate("createdBy", "name email")
      .sort({ name: 1 });

    const clubsWithMeta = await Promise.all(
      clubs.map(async (club) => {
        const memberCount = await ClubMembership.countDocuments({ club: club._id });
        const myMembership = await ClubMembership.findOne({
          club: club._id,
          student: req.user._id,
        });

        return {
          ...club.toObject(),
          memberCount,
          isMember: !!myMembership,
        };
      })
    );

    res.status(200).json({ success: true, count: clubsWithMeta.length, clubs: clubsWithMeta });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single club by ID, including memberCount and isMember
// @route   GET /api/clubs/:id
// @access  Private (any authenticated user)
const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate("createdBy", "name email");

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    const memberCount = await ClubMembership.countDocuments({ club: club._id });
    const myMembership = await ClubMembership.findOne({
      club: club._id,
      student: req.user._id,
    });

    res.status(200).json({
      success: true,
      club: { ...club.toObject(), memberCount, isMember: !!myMembership },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private/Admin
const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    const { name, description, category } = req.body;

    if (name !== undefined) club.name = name;
    if (description !== undefined) club.description = description;
    if (category !== undefined) club.category = category;

    const updated = await club.save();
    const populated = await updated.populate("createdBy", "name email");

    res.status(200).json({ success: true, message: "Club updated successfully", club: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    await club.deleteOne();

    res.status(200).json({ success: true, message: "Club deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
};