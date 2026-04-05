
import Record from "../models/record.model.js";

export const createRecord = async (req, res) => {
  try {
    const record = await Record.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
    } = req.query;

    let filter = {
      createdBy: req.user._id,
    };

    // ✅ Check if NO filters applied
    if (!type && !category && !startDate && !endDate) {
      // 👉 Just return recent records (default behavior)
      const records = await Record.find(filter)
        .sort({ date: -1 }) // latest first
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.json(records);
    }

    // ✅ Apply filters only if provided

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};