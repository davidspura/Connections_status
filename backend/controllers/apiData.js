const handleApi = (req, res, db) => {
  db.select("*")
    .from("connections_api")
    .orderBy("id", "desc")
    .limit(288)
    .then(data => {
      res.json(data);
    });
};
module.exports = {
  handleApi: handleApi
};
