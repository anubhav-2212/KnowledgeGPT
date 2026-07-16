import axios from "axios";
import * as cheerio from "cheerio";

export const extractWebsiteText = async (url) => {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(data);

    // Remove unwanted elements
    $("script").remove();
    $("style").remove();
    $("nav").remove();
    $("footer").remove();
    $("noscript").remove();
    $("iframe").remove();

    const title = $("title").text().trim();

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    return {
      success: true,
      title,
      url,
      text,
    };
  } catch (error) {
    console.error("Website Extraction Error:", error);

    return {
      success: false,
      title: "",
      url,
      text: "",
      error: error.message,
    };
  }
};