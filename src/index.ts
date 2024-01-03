import * as http from "https";
import * as fs from "fs";

const results: Results = {
  "0-100": [],
  "101-200": [],
  "201-300": [],
  "301-n": [],
};

const scrapeUrl = (url: string) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Regex to match the rank, title, points, author and comments
          const rankRegex = /<span class="rank">(\d+)/;
          const titleRegex =
            /<span class="titleline">(?:<a [^>]*href=".*?">)?(.*?)(?:<)/;
          const pointsRegex = /<span class="score" id="score_\d+">(\d+)/;
          const authorRegex = /<a href="user\?id=.*?" class="hnuser">(.*?)</;
          const commentsRegex = /<a href="item\?id=\d+">(\d+)&nbsp;comment/;
          let itemRes = "";

          // Split the data into an array of items
          data
            .split('<tr class="spacer" style="height:5px"></tr>')
            .forEach((item, i) => {
              const rank = item.match(rankRegex) || null;
              const title = item.match(titleRegex) || null;
              const points = item.match(pointsRegex) || null;
              const author = item.match(authorRegex) || null;
              const comments = item.match(commentsRegex) || null;
              if (comments) {
                const commentsCount = parseInt(comments[1], 10);
                const processedData = processData({
                  rank,
                  title,
                  points,
                  author,
                  comments,
                });

                if (commentsCount >= 0 && commentsCount <= 100) {
                  results["0-100"].push(processedData);
                } else if (commentsCount >= 101 && commentsCount <= 200) {
                  results["101-200"].push(processedData);
                } else if (commentsCount >= 201 && commentsCount <= 300) {
                  results["201-300"].push(processedData);
                } else {
                  results["301-n"].push(processedData);
                }
              }
            });
        });
        resolve(true);
      })
      .on("error", (err) => {
        console.error(`Error: ${err}`);
      });
  });
};

const processData = ({ rank, title, points, author, comments }: DataType) => ({
  rank: rank ? rank[1] : null,
  title: title ? title[1] : null,
  points: points ? points[1] : null,
  author: author ? author[1] : null,
  comments: comments ? comments[1] : 0,
});

const scrapeMultipleUrls = async () => {
  for (let i = 1; i <= 20; i++) {
    const url = `https://news.ycombinator.com/?p=${i}`;
    await scrapeUrl(url);
  }

  const jsonResult = JSON.stringify(results, null, 2);
  fs.writeFileSync("results.json", jsonResult);
  console.log("Results saved as results.json");
  return true;
};

scrapeMultipleUrls();

export { scrapeUrl, processData, scrapeMultipleUrls };
