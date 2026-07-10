const ClubMembership = require("../models/ClubMembership");
const Club = require("../models/Club");

// @desc    Join the logged-in student to a club
// @route   POST /api/clubs/:clubId/join
// @access  Private
const joinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.clubId);

    if (!club) {
      res.status(404);
      throw new Error("Club not found");
    }

    const existing = await ClubMembership.findOne({
      club: req.params.clubId,
      student: req.user._id,
    });
    if (existing) {
      res.status(400);
      throw new Error("You are already a member of this club");
    }

    const membership = await ClubMembership.create({
      club: req.params.clubId,
      student: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: `Successfully joined ${club.name}`,
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove the logged-in student from a club
// @route   DELETE /api/clubs/:clubId/join
// @access  Private
const leaveClub = async (req, res, next) => {
  try {
    const membership = await ClubMembership.findOne({
      club: req.params.clubId,
      student: req.user._id,
    });

    if (!membership) {
      res.status(404);
      throw new Error("You are not a member of this club");
    }

    await membership.deleteOne();

    res.status(200).json({ success: true, message: "Left the club successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's club memberships
// @route   GET /api/clubs/my/memberships
// @access  Private
const getMyClubs = async (req, res, next) => {
  try {
    const memberships = await ClubMembership.find({ student: req.user._id })
      .populate("club")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: memberships.length, memberships });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of members for a specific club (admin view)
// @route   GET /api/clubs/:clubId/members
// @access  Private/Admin
const getClubMembers = async (req, res, next) => {
  try {
    const members = await ClubMembership.find({ club: req.params.clubId })
      .populate("student", "name email rollNumber department")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: members.length, members });
  } catch (error) {
    next(error);
  }
};

module.exports = { joinClub, leaveClub, getMyClubs, getClubMembers };