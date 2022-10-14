import React, { useState, createContext } from "react";
import EpnsSDK from "@epnsproject/backend-sdk-staging";
import { api, utils } from "@epnsproject/frontend-sdk-staging";

export const NotificationContext = createContext(undefined);

export const NotificationContextProvider = (props) => {
  const [notificationItems, setNotificationItems] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const CHANNEL_PK = process.env.REACT_APP_EPNS_PRIVATE_KEY;  
  const epnsSdk = new EpnsSDK(CHANNEL_PK);
  async function fetchNotifications(account) {
    if (account) {
      // define the variables required to make a request
      const walletAddress = account;
      const pageNumber = 1;
      const itemsPerPage = 20;
      // fetch the notifications
      const { count, results } = await api.fetchNotifications(
        walletAddress,
        itemsPerPage,
        pageNumber
      );
      // parse all the fetched notifications
      const parsedResponse = utils.parseApiResponse(results);
      setNotificationItems(parsedResponse);
    }
  }
  async function sendNotifications(data) {
    try {
      const tx = await epnsSdk.sendNotification(
        data.to,
        "Studentdesk",
        data.message,
        "",
        "",
        3, //this is the notificationType
        "https://studentdesk.vercel.app/", // a url for users to be redirected to
        "https://studentdesk.vercel.app/assets/images/logo/logo1.png", // an image url, or an empty string
        null //this can be left as null
      );
      setIsUpdated(!isUpdated);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <NotificationContext.Provider
      value={{
        fetchNotifications,
        sendNotifications,
        notificationItems,
        isUpdated,
      }}
      {...props}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};