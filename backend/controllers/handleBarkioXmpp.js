async function handleBarkioXmpp(req, res, db) {
  let data = await db
    .select("*")
    .from("barkioxmpp")
    .limit(288);
  return res.json(data);
}
module.exports = {
  handleBarkioXmpp: handleBarkioXmpp
};
