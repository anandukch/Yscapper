import * as http from "https";
import * as fs from "fs";

const url ="https://news.ycombinator.com/"

http
  .get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      const rankRegex = /<span class="rank">(\d+)/;
      const titleRegex =
        /<span class="titleline">(?:<a [^>]*href=".*?">)?(.*?)(?:<)/;
      const pointsRegex = /<span class="score" id="score_\d+">(\d+)/;
      const authorRegex = /<a href="user\?id=.*?" class="hnuser">(.*?)</;
      const commentsRegex = /<a href="item\?id=\d+">(\d+)&nbsp;comment/;

      // <a href="item?id=38840747">9&nbsp;comments</a>

      const results = {
        "0-100": [],
        "101-200": [],
        "201-300": [],
        "301-n": [],
      };

      // Extract information using regular expressions
      let itemRes = "";
      data
        .split('<tr class="spacer" style="height:5px"></tr>')
        .forEach((item, i) => {
          // console.log(item);

          itemRes += item + "\n\n\n\n";

          const rank = item.match(rankRegex) || null;
          const title = item.match(titleRegex) || null;
          const points = item.match(pointsRegex) || null;
          const author = item.match(authorRegex) || null;
          const comments = item.match(commentsRegex);

          // console.log(i,
          //   comments[1],
          //   rank[1],
          //   title[1],
          //   points[1],
          //   author[1]);

          if (comments) {
            const commentsCount = parseInt(comments[1], 10);
            const processedData = processData(
              rank,
              title,
              points,
              author,
              comments
            );

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
      fs.writeFileSync("item.txt", itemRes);

      const jsonResult = JSON.stringify(results, null, 2);
      fs.writeFileSync("results.json", jsonResult);
      console.log("Results saved as results.json");
    });

    // fs.writeFile("output.txt", data, (err) => {
    //   if (err) {
    //     console.error(`Error writing file: ${err}`);
    //   } else {
    //     console.log("Data saved to output.txt");
    //   }
    // });
  })
  .on("error", (err) => {
    console.error(`Error: ${err}`);
  });

const processData = (
  rank: RegExpMatchArray | null,
  title: RegExpMatchArray | null,
  points: RegExpMatchArray | null,
  author: RegExpMatchArray | null,
  comments: RegExpMatchArray
) => ({
  rank: rank ? rank[1] : null,
  title: title ? title[1] : null,
  points: points ? points[1] : null,
  author: author ? author[1] : null,
  comments: comments ? comments[1] : 0,
});
