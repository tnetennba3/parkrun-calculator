import { Redis } from "@upstash/redis";
import axios from "axios";
import * as cheerio from "cheerio";
import { HttpsProxyAgent } from "https-proxy-agent";
import { NextRequest } from "next/server";

import { calculateCacheExpiryDate } from "@/lib/calculateCacheExpiryDate";
import { formatParkrunDate } from "@/lib/formatParkrunDate";
import { parseParkrunTime } from "@/lib/parseParkrunTime";
import { shouldCacheResults } from "@/lib/shouldCacheResults";
import type { Parkrun, ParkrunData, ParkrunResult } from "@/types";

const redis = Redis.fromEnv();

const PARKRUN_URL = "https://www.parkrun.org.uk";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const httpsAgent = new HttpsProxyAgent(process.env.PROXY!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parkrunId = parseInt((await params).id);

    if (isNaN(parkrunId)) {
      return Response.json(
        {
          error: "Invalid parkrun ID",
          message: "The parkrun ID must only contain numbers",
        },
        { status: 400 },
      );
    }

    const cacheKey = `${process.env.NODE_ENV}:v2:parkrunner:${parkrunId}`;
    const cachedResults = await redis.get<ParkrunData>(cacheKey);

    if (cachedResults) {
      console.log("fetching from cache");
      return Response.json(cachedResults);
    }

    const url = `${PARKRUN_URL}/parkrunner/${parkrunId}/all/`;
    const response = await axios.get(url, { headers, httpsAgent });

    const $ = cheerio.load(response.data);

    const firstName = $("h2").text().split(" ")[0];
    const table = $('table:has(caption:contains("Results"))');
    const results: ParkrunResult[] = [];

    table.find("tr").each((i, row) => {
      const columns = $(row).find("td");
      if (columns.length > 0) {
        const parkrun = $(columns[0]).text().trim() as Parkrun;
        const date = formatParkrunDate($(columns[1]).text().trim());
        const time = parseParkrunTime($(columns[4]).text().trim());

        results.push({ date, parkrun, time });
      }
    });

    const parkrunData = { firstName, results };

    if (shouldCacheResults(results)) {
      await redis.set(cacheKey, parkrunData, {
        ex: Math.floor(calculateCacheExpiryDate().diffNow().as("seconds")),
      });
    }

    return Response.json(parkrunData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error);

      return Response.json(
        {
          error: error.response?.statusText,
          details: error instanceof Error ? error.message : error,
          data: error.response?.data,
        },
        { status: error.status || 500 },
      );
    }

    console.error("Unexpected error:", error);

    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
