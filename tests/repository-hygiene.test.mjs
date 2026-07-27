import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("generated dependency trees are not tracked", () => {
  const tracked = execFileSync("git", ["-C", repository, "ls-files"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);

  assert.deepEqual(
    tracked.filter((file) => file.split("/").includes("node_modules")),
    [],
  );
});
