import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import YAML from "yaml";

export function readYaml(filePath: string): unknown {
  const content = readFileSync(filePath, "utf-8");
  return YAML.parse(content);
}

export function writeJson(filePath: string, data: unknown): void {
  ensureDir(dirname(filePath));
  const content = JSON.stringify(data, null, 2) + "\n";
  writeFileSync(filePath, content, "utf-8");
}

export function writeText(filePath: string, content: string): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, "utf-8");
}

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}
