import fs from "fs/promises";
import path from "path";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, response } = JSON.parse(event.body);
  const file = path.join(process.env.LAMBDA_TASK_ROOT, "rsvp.json");

  // read current JSON (or start empty)
  let data = [];
  try { data = JSON.parse(await fs.readFile(file, "utf8")); } catch {}
  data.push({ name, response, ts: Date.now() });
  await fs.writeFile(file, JSON.stringify(data, null, 2));

  return { statusCode: 200, body: "OK" };
}
