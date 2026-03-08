/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const unityInputReaderPath =
  process.argv[2] ||
  'C:\\Users\\alext\\Cloud Repositories\\Learning c\\Assets\\Scripts\\InputManagers\\InputReader.cs';

const outPath =
  process.argv[3] ||
  path.join(process.cwd(), 'src', 'data', 'unity-inputreader-map.json');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function findMethods(source) {
  const lines = source.split('\n');
  const methods = [];
  const sigRegex = /^\s*public\s+void\s+(Q\d+(?:_\d+)?)\s*\(([^)]*)\)\s*$/;

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(sigRegex);
    if (!match) continue;

    const methodName = match[1];
    const args = match[2].trim();

    let start = i;
    while (start < lines.length && !lines[start].includes('{')) start += 1;
    if (start >= lines.length) continue;

    let depth = 0;
    let end = start;
    for (; end < lines.length; end += 1) {
      const line = lines[end];
      depth += (line.match(/{/g) || []).length;
      depth -= (line.match(/}/g) || []).length;
      if (depth === 0) break;
    }

    const body = lines.slice(start, end + 1).join('\n');
    methods.push({ methodName, args, body });
    i = end;
  }

  return methods;
}

function extractAll(regex, text, group = 1) {
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push(match[group]);
  }
  return results;
}

function classifyMethod(method) {
  const outputTexts = extractAll(/output\.text\s*=\s*"([^"]*)"/g, method.body);
  const answerTexts = extractAll(/answer\.text\s*=\s*"([^"]*)"/g, method.body);
  const unlockButtons = extractAll(
    /OnUnlockedButton\?\.\Invoke\("([^"]+)"\s*,\s*(\d+)\)/g,
    method.body,
    0
  ).map((s) => {
    const m = s.match(/OnUnlockedButton\?\.\Invoke\("([^"]+)"\s*,\s*(\d+)\)/);
    return { lessonKey: m[1], index: Number(m[2]) };
  });
  const unlockMultiples = extractAll(
    /OnUnlockedMultiple\?\.\Invoke\("([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\)/g,
    method.body,
    0
  ).map((s) => {
    const m = s.match(
      /OnUnlockedMultiple\?\.\Invoke\("([^"]+)"\s*,\s*(\d+)\s*,\s*(\d+)\)/
    );
    return { lessonKey: m[1], buttonIndex: Number(m[2]), gateIndex: Number(m[3]) };
  });

  const hasUserInput =
    /input(_[a-z])?|user_input|TryParse|TMP_InputField|StartsWith|EndsWith/.test(method.body);
  const hasChoice = /\boption\b|\bans\b|\bswitch\s*\(/.test(method.body);

  return {
    outputTexts,
    answerTexts,
    unlockButtons,
    unlockMultiples,
    interactionType: hasChoice ? 'choice' : hasUserInput ? 'input' : 'display',
  };
}

function buildMap(methods) {
  const byLesson = {};
  for (const method of methods) {
    const lessonNumber = Number(method.methodName.match(/^Q(\d+)/)[1]);
    if (!byLesson[lessonNumber]) byLesson[lessonNumber] = [];
    const details = classifyMethod(method);
    byLesson[lessonNumber].push({
      id: method.methodName,
      args: method.args,
      ...details,
    });
  }

  const lessonKeys = Object.keys(byLesson).sort((a, b) => Number(a) - Number(b));
  return lessonKeys.map((k) => ({
    lessonNumber: Number(k),
    steps: byLesson[k].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
  }));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const source = readFile(unityInputReaderPath);
  const methods = findMethods(source);
  const map = buildMap(methods);
  ensureDir(outPath);
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2));
  console.log(`Extracted ${methods.length} methods to ${outPath}`);
}

main();
