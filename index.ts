"use strict";
import cron from "node-cron";
import { writeFileSync } from "fs";

import {
  postToMattermostChannel,
  fetchClickUpLists,
  fetchClickUpTasks,
} from "./api";

require("dotenv").config();

type ClickUpList = {
  id: number;
  name: string;
};

async function fillReportData() {
  const {
    data: { lists },
  } = await fetchClickUpLists();

  const currentList = (lists || []).find((list: ClickUpList) =>
    list.name.includes("current")
  );

  if (!currentList) throw new Error("Cann't find current tasks list");

  const {
    data: { tasks },
  } = await fetchClickUpTasks(currentList.id);

  let report = "";
  report += `#### ${currentList.name} \n`;
  report += `<!channel> Below is my updating task list today: \n\n`;
  report += `|Planning Task|Status|Link Description|\n`;
  report += `|:-----------|:-----------:|:-----------------------------------------------|\n`;
  tasks.forEach(({ name, id, status: { status }, url }: any) => {
    report += `|${name}|${status.toUpperCase()}|[#${id}](${url})|\n`;
  });
  writeFileSync(`./reports/${new Date().toISOString()}.txt`, report);
  return report;
}

// 0 2 * * *
// * * * * *
cron.schedule("0 2 * * *", async function () {
  try {
    // fetch data from task manager system, also save to reports directory
    console.info("Fetching data...");
    const report = await fillReportData();

    // post to mattermost
    const request_body = {
      channel: "madlogic",
      username: "tuan.tran",
      icon_url:
        "https://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
      text: report,
    };

    console.info("Sending message...");
    await postToMattermostChannel(request_body);
    console.info("Success!");
  } catch (e) {
    console.error(e);
  }
});
