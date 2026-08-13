import assert from "node:assert/strict";
import test from "node:test";
import { isNewMenuItem } from "../src/services/menuRecency.js";

const now = Date.parse("2026-08-13T12:00:00.000Z");
const daysAgo = (days) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

test("food created today is new", () => {
  assert.equal(isNewMenuItem({ dateCreated: daysAgo(0) }, now), true);
});

test("food created 29 days ago is new", () => {
  assert.equal(isNewMenuItem({ dateCreated: daysAgo(29) }, now), true);
});

test("food created more than 30 days ago is not new", () => {
  assert.equal(isNewMenuItem({ dateCreated: daysAgo(31) }, now), false);
});

test("food with a null creation date is not new", () => {
  assert.equal(isNewMenuItem({ dateCreated: null }, now), false);
});
