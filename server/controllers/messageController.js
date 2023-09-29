const Messages = require("../models/messageModel");
const mongoose = require("mongoose");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.getMessage = async (req, res, next) => {
  try {
    const { from, to, lastMessageId, limit } = req.body;

    if (lastMessageId === false) {
      res.json({ messages: [], getLastMsgId: false });
    } else {
       const query = {
         users: {
           $all: [from, to],
         },
       };

      if (lastMessageId) {
        query["_id"] = { $lt: new mongoose.Types.ObjectId(lastMessageId) }; // Fetch messages before the specific message id
      }
      const messages = await Messages.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit);
      const getLastMsgId =
        messages.length > 0 ? messages[messages.length - 1]._id : false;
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.json({ messages: projectedMessages.reverse(), getLastMsgId });
    }
  } catch (err) {
    next(err);
  }
};
