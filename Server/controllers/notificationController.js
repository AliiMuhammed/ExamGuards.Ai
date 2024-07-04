const Notification = require("../models/notifcationsModel"); // Adjust the path as needed
const io = require("../path/to/socketInstance"); // Adjust the path as needed

exports.createNotification = async (req, res) => {
  try {
    const { to, type, priority, read, data } = req.body;
    const newNotification = new Notification({
      to,
      type,
      priority,
      read,
      data,
    });
    await newNotification.save();

    // Emit the new notification to all connected clients
    io.emit("newNotification", newNotification);

    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
