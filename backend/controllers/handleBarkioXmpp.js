const handleBarkioXmpp = (req, res, db) => {
  db.select("*")
    .from("barkioxmpp")

    .limit(288)
    .then(data => {
      res.json(data);
    });
};
module.exports = {
  handleBarkioXmpp: handleBarkioXmpp
};
