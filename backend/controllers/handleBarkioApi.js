const handleBarkioApi = (req, res, db) => {
  db.select("*")
    .from("barkioapi")

    .limit(288)
    .then(data => {
      res.json(data);
    });
};
module.exports = {
  handleBarkioApi: handleBarkioApi
};
