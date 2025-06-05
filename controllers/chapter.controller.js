const mongoose = require("mongoose");
const Chapter = require("../models/chapter.model");
const redis = require("../utils/redisClient");

const uploadChapters = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const jsonStr = req.file.buffer.toString("utf-8");
    const chapters = JSON.parse(jsonStr);

    if (!Array.isArray(chapters)) {
      return res
        .status(400)
        .json({ message: "Uploaded file must be a JSON array" });
    }

    const failed = [];
    const success = [];

    for (const data of chapters) {
      try {
        // const chapter = new Chapter(data);
        // await chapter.validate(); // Validate without saving first
        // await chapter.save();
        // success.push(chapter);
        const updatedChapter = await Chapter.findOneAndUpdate(
          {
            chapter: data.chapter,
            class: data.class,
            subject: data.subject,
          },
          {
            $set: {
              unit: data.unit,
              yearWiseQuestionCount: data.yearWiseQuestionCount,
              questionSolved: data.questionSolved,
              status: data.status,
              isWeakChapter: data.isWeakChapter,
            },
          },
          {
            new: true, // Return the updated document
            upsert: true, // Insert if no match is found
            runValidators: true, // Validate before insert/update
          }
        );
        await updatedChapter.save();
        success.push(updatedChapter);
      } catch (err) {
        failed.push({ data, error: err.message });
      }
    }

    // Invalidate all chapter cache keys
    const keys = await redis.keys("chapters:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.status(201).json({
      success: "true",
      message: "Chapters uploaded. Cache cleared",
      successCount: success.length,
      failedCount: failed.length,
      failed,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to upload chapters", error: err.message });
  }
};

const getChapters = async (req, res) => {
  try {
    const filterQueries = req.query;
    const redisKey = `chapters:${JSON.stringify(filterQueries)}`;

    // Try to get from Redis
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        cached: true,
        ...JSON.parse(cachedData),
      });
    }

    let {
      class: classFilter,
      unit,
      status,
      subject,
      weakChapters,
      page,
      limit,
    } = req.query;

    const query = {};

    if (classFilter) query.class = new RegExp(`^${classFilter}$`, "i");
    if (unit) query.unit = new RegExp(`^${unit}$`, "i");
    if (status) query.status = new RegExp(`^${status}$`, "i");
    if (subject) query.subject = new RegExp(`^${subject}$`, "i");

    if (weakChapters === "true") query.isWeakChapter = true;
    if (weakChapters === "false") query.isWeakChapter = false;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = await Chapter.countDocuments(query);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [chapters, total] = await Promise.all([
      Chapter.find(query).skip(skip).limit(Number(limit)),
      Chapter.countDocuments(query),
    ]);

    // res.status(200).json({
    //   total,
    //   count: chapters.length,
    //   page: Number(page),
    //   limit: Number(limit),
    //   chapters,
    // });

    const response = {
      success: true,
      totalChaptersForQuery: total,
      count: chapters.length,
      page: Number(page),
      limit: Number(limit),
      chapters,
    };

    await redis.set(redisKey, JSON.stringify(response), "EX", 60 * 60);
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch chapters", error: err.message });
  }
};

const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid chapter ID" });
    }

    // Find chapter by ID
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }

    res.status(200).json({ success: true, chapter });
  } catch (error) {
    console.error("Error fetching chapter by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  uploadChapters,
  getChapters,
  getChapterById,
};
