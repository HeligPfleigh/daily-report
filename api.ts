import axios from "axios";

require("dotenv").config();

const CLICK_UP_URL = "https://api.clickup.com/api/v2";
const FOLDER_ID = 6685706;
const ASSIGNEE_ID = 3666245;

type MattermostWebhookData = {
  channel: string;
  username: string;
  icon_url: string;
  text: string;
};

const clickupInstance = axios.create({
  headers: {
    Authorization: process.env.CLICK_UP_API_TOKEN,
  },
  baseURL: CLICK_UP_URL,
});

export const fetchClickUpLists = (folder_id: number = FOLDER_ID) =>
  clickupInstance.get(`/folder/${folder_id}/list`);

export const fetchClickUpTasks = (list_id: number) =>
  clickupInstance.get(`/list/${list_id}/task`, {
    params: {
      assignees: [ASSIGNEE_ID],
    },
  });

export const postToMattermostChannel = (data: MattermostWebhookData) =>
  axios.post(process.env.MATTERMOST_INCOMMING_WEBHOOK, data);
