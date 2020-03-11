async function handleBarkioApi(req, res, db) {
  let data = await db
    .select("*")
    .from("barkioapi")
    .limit(288);
  return res.json(data);
}
module.exports = {
  handleBarkioApi: handleBarkioApi
};
