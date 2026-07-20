const LostFoundItem = require("../models/LostFoundItem");

// @desc    Report a lost or found item
// @route   POST /api/lostfound
// @access  Private
const reportItem = async (req, res, next) => {
  try {
    const { type, itemName, description, location, imageUrl } = req.body;

    if (!type || !itemName) {
      res.status(400);
      throw new Error("Type and item name are required");
    }

    if (!["lost", "found"].includes(type)) {
      res.status(400);
      throw new Error("Type must be either 'lost' or 'found'");
    }

    const item = await LostFoundItem.create({
      type,
      itemName,
      description,
      location,
      imageUrl,
      reportedBy: req.user._id,
    });

    const populated = await item.populate("reportedBy", "name email");

    res.status(201).json({ success: true, item: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all lost & found items, optionally filtered by type/status
// @route   GET /api/lostfound?type=&status=
// @access  Private (any authenticated user)
const getItems = async (req, res, next) => {
  try {
    const { type, status } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const items = await LostFoundItem.find(query)
      .populate("reportedBy", "name email")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in user's own reported items
// @route   GET /api/lostfound/my
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await LostFoundItem.find({ reportedBy: req.user._id })
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim a found item
// @route   POST /api/lostfound/:id/claim
// @access  Private
const claimItem = async (req, res, next) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    if (item.type !== "found") {
      res.status(400);
      throw new Error("Only found items can be claimed");
    }

    if (item.status !== "open") {
      res.status(400);
      throw new Error("This item has already been claimed or verified");
    }

    item.status = "claimed";
    item.claimedBy = req.user._id;
    await item.save();

    const populated = await item.populate([
      { path: "reportedBy", select: "name email" },
      { path: "claimedBy", select: "name email" },
    ]);

    res.status(200).json({ success: true, message: "Claim submitted, pending admin verification", item: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin verifies a claim (marks the item resolved)
// @route   PUT /api/lostfound/:id/verify
// @access  Private/Admin
const verifyClaim = async (req, res, next) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    if (item.status !== "claimed") {
      res.status(400);
      throw new Error("This item has no pending claim to verify");
    }

    item.status = "verified";
    await item.save();

    res.status(200).json({ success: true, message: "Claim verified successfully", item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lost & found item (own report, or admin)
// @route   DELETE /api/lostfound/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    if (req.user.role !== "admin" && item.reportedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own reports");
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { reportItem, getItems, getMyItems, claimItem, verifyClaim, deleteItem };