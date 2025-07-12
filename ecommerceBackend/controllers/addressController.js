const Address = require("../models/addressModel");

exports.addAddress = async (req, res, next) => {
  try {
    const data = { ...req.body, customer_id: req.user._id };
    const address = await Address.create(data);

    if (address.isDefault) {
      await Address.updateMany(
        { customer_id: req.user._id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }

    res.status(201).json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

exports.listAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ customer_id: req.user._id }).sort(
      "-updatedAt"
    );
    res.status(200).json({ success: true, count: addresses.length, addresses });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      customer_id: req.user._id,
    });

    if (!address)
      return res.status(404).json({ success: false, message: "Not found" });

    Object.assign(address, req.body);
    await address.save();

    // Ensure only one default
    if (address.isDefault) {
      await Address.updateMany(
        { customer_id: req.user._id, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }

    res.status(200).json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const result = await Address.deleteOne({
      _id: req.params.id,
      customer_id: req.user._id,
    });
    if (!result.deletedCount)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
