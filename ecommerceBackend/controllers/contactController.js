const Contact = require("../models/contactModel");

exports.createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone_no, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email & message are required",
        });
    }

    const contact = await Contact.create({
      name,
      email,
      phone_no,
      subject,
      message,
    });

    res.status(201).json({ success: true, contact });
  } catch (err) {
    next(err);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort("-createdAt");
    res.status(200).json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    next(err);
  }
};

exports.respondToContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;
    const adminId = req.user._id;

    if (!responseMessage) {
      return res
        .status(400)
        .json({ success: false, message: "Response message required" });
    }

    const contact = await Contact.findById(id);
    if (!contact)
      return res.status(404).json({ success: false, message: "Not found" });

    contact.responded = true;
    contact.respondedAt = new Date();
    contact.respondedBy = adminId;
    contact.responseMessage = responseMessage; // optional: add this field in schema if you need it

    await contact.save();

    res.status(200).json({ success: true, contact });
  } catch (err) {
    next(err);
  }
};
