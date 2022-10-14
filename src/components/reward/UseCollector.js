import moment from "moment";
import { useMoralis } from "react-moralis";

function UseCollector() {
  const { Moralis, account, user, isInitialized } = useMoralis();

  const getUser = async () => {
    if (isInitialized) {
      const users = Moralis.Object.extend("UsePointsTable");
      const query = new Moralis.Query(users);
      query.equalTo("user", user.id);
      const data = await query.first();

      if (data != undefined) {
        // const { lastCollectedPoints } = data.attributes;
        // if (!moment(lastCollectedPoints).isSame(moment.utc().subtract(1, "days"), "day") &&
        //     !moment(lastCollectedPoints).isSame(moment.utc(), "day")) {
        //     data.set("daysInRow", 0);
        // }
        return data;
      } else if (account) {
        const newUser = new users();
        newUser.set("ethAddress", account);
        newUser.set("points", 0);
        newUser.set("daysInRow", 0);
        newUser.set("lastCollectedPoints", "2022-01-25T06:16:06.689Z");
        await newUser.save();
        return newUser;
      }
    }
  };
  return { getUser };
}

export default UseCollector;
