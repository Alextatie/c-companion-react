/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const scenePath =
  process.argv[2] || 'C:\\Users\\alext\\Learning c (1)\\Assets\\Scenes\\Main.unity';
const outDir = process.argv[3] || path.join(process.cwd(), 'src', 'data');

function readScene(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function splitBlocks(source) {
  const headers = [...source.matchAll(/^--- !u!(\d+) &(\d+)$/gm)].map((m) => ({
    type: Number(m[1]),
    id: Number(m[2]),
    index: m.index,
  }));

  const blocks = [];
  for (let i = 0; i < headers.length; i += 1) {
    const start = source.indexOf('\n', headers[i].index) + 1;
    const end = i + 1 < headers.length ? headers[i + 1].index : source.length;
    blocks.push({
      type: headers[i].type,
      id: headers[i].id,
      body: source.slice(start, end),
    });
  }

  return blocks;
}

function buildGraph(blocks) {
  const gameObjects = new Map();
  const transformToGo = new Map();
  const goToParent = new Map();
  const childrenByGo = new Map();
  const textByGo = new Map();

  for (const block of blocks) {
    if (block.type === 1) {
      const nameMatch = block.body.match(/m_Name:\s*(.*)\r?\n/);
      const componentIds = [...block.body.matchAll(/- component: \{fileID: (\d+)\}/g)].map((m) =>
        Number(m[1])
      );
      gameObjects.set(block.id, {
        id: block.id,
        name: nameMatch ? nameMatch[1] : '',
        componentIds,
      });
    }
  }

  for (const block of blocks) {
    if (block.type !== 4 && block.type !== 224) continue;
    const gameObjectMatch = block.body.match(/m_GameObject: \{fileID: (\d+)\}/);
    if (!gameObjectMatch) continue;
    transformToGo.set(block.id, Number(gameObjectMatch[1]));
  }

  for (const block of blocks) {
    if (block.type !== 4 && block.type !== 224) continue;
    const gameObjectMatch = block.body.match(/m_GameObject: \{fileID: (\d+)\}/);
    if (!gameObjectMatch) continue;
    const childGo = Number(gameObjectMatch[1]);
    const parentTransformMatch = block.body.match(/m_Father: \{fileID: (-?\d+)\}/);
    const parentTransformId = parentTransformMatch ? Number(parentTransformMatch[1]) : 0;
    const parentGo = transformToGo.get(parentTransformId) || 0;
    goToParent.set(childGo, parentGo);
  }

  for (const [child, parent] of goToParent.entries()) {
    if (!parent) continue;
    if (!childrenByGo.has(parent)) {
      childrenByGo.set(parent, []);
    }
    childrenByGo.get(parent).push(child);
  }

  for (const block of blocks) {
    if (block.type !== 114) continue;
    const gameObjectMatch = block.body.match(/m_GameObject: \{fileID: (\d+)\}/);
    if (!gameObjectMatch) continue;
    const goId = Number(gameObjectMatch[1]);

    const textMatch = block.body.match(/\n  m_text:\s*(.*)\r?\n/);
    if (!textMatch) continue;

    let raw = textMatch[1];
    if (raw.startsWith("'") && raw.endsWith("'")) {
      raw = raw.slice(1, -1);
    } else if (raw.startsWith('"') && raw.endsWith('"')) {
      raw = raw.slice(1, -1);
    }

    const text = raw.replace(/\\n/g, '\n').replace(/\\r/g, '\r').trim();
    if (!text) continue;

    if (!textByGo.has(goId)) {
      textByGo.set(goId, []);
    }
    textByGo.get(goId).push(text);
  }

  return {
    gameObjects,
    goToParent,
    childrenByGo,
    textByGo,
  };
}

function descendants(rootGo, childrenByGo) {
  const result = [];
  const stack = [rootGo];
  while (stack.length > 0) {
    const current = stack.pop();
    const children = childrenByGo.get(current) || [];
    for (const child of children) {
      result.push(child);
      stack.push(child);
    }
  }
  return result;
}

function ancestorPath(goId, goToParent, gameObjects) {
  const names = [];
  let current = goId;
  while (current) {
    const parent = goToParent.get(current) || 0;
    if (!parent) break;
    names.push(gameObjects.get(parent)?.name || String(parent));
    current = parent;
  }
  return names;
}

function isQuestionNumberName(name) {
  return /^([1-9]|[1-6]\d|70)$/.test(name || '');
}

function buildGameQuestionExport(gameRootName, graph) {
  const { gameObjects, goToParent, childrenByGo, textByGo } = graph;

  const gameRootId = [...gameObjects.entries()].find(([, value]) => value.name === gameRootName)?.[0];
  if (!gameRootId) {
    throw new Error(`Could not find game root "${gameRootName}"`);
  }

  const underRoot = descendants(gameRootId, childrenByGo);
  const numericObjects = underRoot
    .map((id) => gameObjects.get(id))
    .filter((go) => go && isQuestionNumberName(go.name));

  const grouped = new Map();
  for (const go of numericObjects) {
    const number = Number(go.name);
    if (!grouped.has(number)) grouped.set(number, []);
    grouped.get(number).push(go.id);
  }

  const questions = [];
  for (let questionNumber = 1; questionNumber <= 70; questionNumber += 1) {
    const candidates = grouped.get(questionNumber) || [];
    if (candidates.length === 0) {
      questions.push({
        questionNumber,
        objectId: null,
        texts: [],
        candidateCount: 0,
      });
      continue;
    }

    const scored = candidates.map((candidateId) => {
      const tree = [candidateId, ...descendants(candidateId, childrenByGo)];
      const texts = [];
      for (const goId of tree) {
        for (const text of textByGo.get(goId) || []) {
          texts.push({
            objectId: goId,
            objectName: graph.gameObjects.get(goId)?.name || '',
            text,
          });
        }
      }

      const nonNumericTextCount = texts.filter((entry) => !/^\d+$/.test(entry.text)).length;
      return {
        candidateId,
        texts,
        score: nonNumericTextCount,
        path: ancestorPath(candidateId, goToParent, gameObjects),
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    questions.push({
      questionNumber,
      objectId: best.candidateId,
      ancestorPath: best.path,
      candidateCount: candidates.length,
      texts: best.texts,
    });
  }

  return {
    gameRootName,
    gameRootId,
    extractedAt: new Date().toISOString(),
    questionCount: questions.length,
    questions,
  };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const source = readScene(scenePath);
  const blocks = splitBlocks(source);
  const graph = buildGraph(blocks);

  const codeFixer = buildGameQuestionExport('Code Fixer', graph);
  const quizRush = buildGameQuestionExport('Time Attack', graph);

  ensureDir(outDir);
  const codeFixerOut = path.join(outDir, 'unity-code-fixer-questions.json');
  const quizRushOut = path.join(outDir, 'unity-quiz-rush-questions.json');
  const summaryOut = path.join(outDir, 'unity-play-question-import-summary.json');

  writeJson(codeFixerOut, codeFixer);
  writeJson(quizRushOut, quizRush);
  writeJson(summaryOut, {
    sourceScene: scenePath,
    generatedAt: new Date().toISOString(),
    outputs: [codeFixerOut, quizRushOut],
    codeFixer: {
      gameRootId: codeFixer.gameRootId,
      questionCount: codeFixer.questionCount,
      missingRoots: codeFixer.questions.filter((q) => !q.objectId).map((q) => q.questionNumber),
    },
    quizRush: {
      gameRootId: quizRush.gameRootId,
      questionCount: quizRush.questionCount,
      missingRoots: quizRush.questions.filter((q) => !q.objectId).map((q) => q.questionNumber),
    },
  });

  console.log(`Wrote ${codeFixerOut}`);
  console.log(`Wrote ${quizRushOut}`);
  console.log(`Wrote ${summaryOut}`);
}

main();
