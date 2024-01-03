// tslint:disable: only-arrow-functions
import { expect } from "chai";
import { processData, scrapeUrl } from "../src";
import assert = require("assert");

describe("Index module", function () {
  describe("expected behavior", function () {
    it("process data should work correctly", function () {
      const rank = [null, "1"];
      const title = [null, "title"];
      const points = [null, "100"];
      const author = [null, "author"];
      const comments = [null, "100"];
      const processedData = processData({
        rank,
        title,
        points,
        author,
        comments,
      });
      expect(processedData).to.deep.equal({
        rank: "1",
        title: "title",
        points: "100",
        author: "author",
        comments: "100",
      });
    });
    it("scrape url should work correctly", async () => {
      return await scrapeUrl("https://news.ycombinator.com/?p=1").then(
        (res) => {
          expect(res).to.equal(true);
        }
      );
    });
  });
});
