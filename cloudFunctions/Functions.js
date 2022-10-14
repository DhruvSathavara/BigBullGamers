Moralis.Cloud.define("getAllBigBullPosts", async (request) => {
  const query = new Moralis.Query("BigBullPosts");
  query.descending("createdAt");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getAllUser", async (request) => {
  const query = new Moralis.Query("User");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getPaidScholar", async (request) => {
  const query = new Moralis.Query("PayScholarship");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getAllMintedPost", async (request) => {
  const query = new Moralis.Query("MintedPosts");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getMintedPost", async (request) => {
  const query = new Moralis.Query("NftPost");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("sendWelcomeEmail", (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info("logs" + "request");
  Moralis.Cloud.sendEmail({
    to: request.params.email,
    templateId: "d-548c146b82e14f3f846b270088abf3a2",
    dynamic_template_data: {
      name: request.params.name,
    },
  });
});

Moralis.Cloud.define("getAllContest", async (request) => {
  const query = new Moralis.Query("UserContests");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getAllContestParticipate", async (request) => {
  const query = new Moralis.Query("JoinContest");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getAllDeals", async (request) => {
  const query = new Moralis.Query("SuperDeals");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getAllFunds", async (request) => {
  const query = new Moralis.Query("CrowdFund");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("getGroups", async (request) => {
    const query = new Moralis.Query("Groups");
    const results = await query.find({ useMasterKey: true });
    return results;
  });
