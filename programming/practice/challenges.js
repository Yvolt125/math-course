// ── Virtual filesystem set up before every challenge run ─────────────────────
// Runs in Pyodide via exec() before user code. Creates /workspace with sample data.
const GLOBAL_FS_SETUP = `
import os, json, csv as _csv

for _d in ['/workspace/data/sales', '/workspace/data/reports', '/workspace/logs']:
    os.makedirs(_d, exist_ok=True)

_files = {
    '/workspace/data/sales/q1_2024.csv': 'date,product,revenue\\n2024-01-15,Widget A,1200\\n2024-02-20,Widget B,850\\n2024-03-30,Widget C,500\\n',
    '/workspace/data/sales/q2_2024.csv': 'date,product,revenue\\n2024-04-10,Widget A,1350\\n2024-05-18,Widget C,920\\n2024-06-22,Widget B,780\\n',
    '/workspace/data/reports/summary.txt': 'Q1 Total Revenue: 2550\\nQ2 Total Revenue: 3050\\nBest Product: Widget A\\n',
    '/workspace/data/reports/notes.txt': 'Review Q3 projections\\nSchedule team meeting\\n',
    '/workspace/logs/app.log': '2024-01-01 08:00 INFO Process started\\n2024-01-01 09:15 ERROR Connection timeout\\n2024-01-02 10:00 INFO Daily backup complete\\n',
    '/workspace/config.json': '{"version": "2.1", "debug": false, "max_files": 100, "output_dir": "data/reports"}'
}
for _path, _content in _files.items():
    with open(_path, 'w') as _f:
        _f.write(_content)

os.chdir('/workspace')
`;

// ── Challenge data ────────────────────────────────────────────────────────────
// Each challenge:
//   id, unit, unitId, order, title, emoji, description, context,
//   starterCode, setup (extra per-challenge setup), test (assertion code),
//   hint, xp

const CHALLENGES = [

  // ════════════════════════════════════════════════════════════
  //  UNIT 1 — File System Basics
  // ════════════════════════════════════════════════════════════

  {
    id: 'fs-001', unit: 'File System Basics', unitId: 'unit1', order: 1,
    title: 'Where are you?', emoji: '📍',
    description: `Before touching any files, it's good practice to know exactly **where you are** in the filesystem.

**Task:** Store the current working directory path in a variable called \`result\`.`,
    context: 'You are in `/workspace`. The `os` module is available to import.',
    starterCode: `import os

# Get the current working directory
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the path to a variable called 'result'"
assert isinstance(_ns['result'], str), "result should be a string"
assert _ns['result'] == '/workspace', f"Expected '/workspace', got '{_ns['result']}'"
print("✓ Correct! You're in:", _ns['result'])
`,
    hint: '`os.getcwd()` returns the current working directory as a string.',
    xp: 10
  },

  {
    id: 'fs-002', unit: 'File System Basics', unitId: 'unit1', order: 2,
    title: "What's in here?", emoji: '📂',
    description: `List everything in the current directory and store it in \`result\`.

You should see folders like \`data\` and \`logs\`, plus a \`config.json\` file.`,
    context: 'You are in `/workspace`.',
    starterCode: `import os

# List all items in the current directory
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the listing to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert 'data' in r, "Should contain a 'data' folder"
assert 'config.json' in r, "Should contain 'config.json'"
assert 'logs' in r, "Should contain a 'logs' folder"
print(f"✓ Found {len(r)} items:", r)
`,
    hint: '`os.listdir(path)` lists items in a directory. Use `"."` for current directory.',
    xp: 10
  },

  {
    id: 'fs-003', unit: 'File System Basics', unitId: 'unit1', order: 3,
    title: 'Find the CSVs', emoji: '🔍',
    description: `You need just the CSV files from the \`data/sales/\` folder — not everything else.

**Task:** Store a list of **filenames** (not full paths) that end in \`.csv\` in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import os

# List only .csv files in data/sales/
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 2, f"Expected 2 CSV files, found {len(r)}"
assert all(f.endswith('.csv') for f in r), "All items should end in .csv"
print("✓ Found:", sorted(r))
`,
    hint: 'Use `os.listdir()` then filter: `[f for f in os.listdir(folder) if f.endswith(".csv")]`',
    xp: 15
  },

  {
    id: 'fs-004', unit: 'File System Basics', unitId: 'unit1', order: 4,
    title: 'Does it exist?', emoji: '❓',
    description: `A good script always checks before opening a file — especially when the path comes from user input or config.

**Task:** Check whether \`data/reports/summary.txt\` exists. Store \`True\` or \`False\` in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import os

# Check if data/reports/summary.txt exists
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign True or False to 'result'"
assert _ns['result'] is True, "data/reports/summary.txt does exist — result should be True"
print("✓ Correct — file exists:", _ns['result'])
`,
    hint: '`os.path.exists(path)` returns `True` or `False`.',
    xp: 10
  },

  {
    id: 'fs-005', unit: 'File System Basics', unitId: 'unit1', order: 5,
    title: 'How big is it?', emoji: '📏',
    description: `Useful when processing large datasets — check the file size before loading.

**Task:** Get the size in **bytes** of \`config.json\` and store it in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import os

# Get the size of config.json in bytes
result = `,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "Assign the file size to 'result'"
r = _ns['result']
assert isinstance(r, int), f"Size should be an integer, got {type(r).__name__}"
assert r > 0, "Size should be greater than 0"
expected = _os.path.getsize('/workspace/config.json')
assert r == expected, f"Expected {expected} bytes, got {r}"
print(f"✓ config.json is {r} bytes")
`,
    hint: '`os.path.getsize(path)` returns the file size in bytes as an integer.',
    xp: 15
  },

  {
    id: 'fs-006', unit: 'File System Basics', unitId: 'unit1', order: 6,
    title: 'Walk the whole tree', emoji: '🌲',
    description: `Real data projects often have nested folders. You need to find **all files** everywhere inside \`data/\` — not just the top level.

**Task:** Store a list of **full paths** of every file inside \`data/\` (including subfolders) in \`result\`.`,
    context: 'You are in `/workspace`. Order doesn\'t matter.',
    starterCode: `import os

# Find all files inside data/ including subdirectories
result = []

# Hint: os.walk() or pathlib.Path.rglob() both work
`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = [str(p) for p in _ns['result']]
assert isinstance(_ns['result'], list), "result should be a list"
assert len(r) == 4, f"Expected 4 files total in data/, found {len(r)}"
assert any('q1_2024.csv' in p for p in r), "Should include q1_2024.csv"
assert any('q2_2024.csv' in p for p in r), "Should include q2_2024.csv"
assert any('summary.txt' in p for p in r), "Should include summary.txt"
print(f"✓ Found {len(r)} files:", [p.split('/')[-1] for p in r])
`,
    hint: '`os.walk(dir)` yields `(folder, subfolders, files)` for each level. Build full paths with `os.path.join(folder, f)` inside a loop.',
    xp: 20
  },

  // ════════════════════════════════════════════════════════════
  //  UNIT 2 — Working with Paths
  // ════════════════════════════════════════════════════════════

  {
    id: 'path-001', unit: 'Working with Paths', unitId: 'unit2', order: 1,
    title: 'Join paths safely', emoji: '🔗',
    description: `Never build paths by concatenating strings — \`"data" + "/" + "sales"\` breaks on Windows. Use \`os.path.join()\` instead.

**Task:** Join \`"data"\`, \`"sales"\`, and \`"q1_2024.csv"\` into a single path. Store in \`result\`.`,
    context: '`os` is available to import. You are in `/workspace`.',
    starterCode: `import os

# Join three parts into a path
result = `,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "Assign the joined path to 'result'"
r = _ns['result']
expected = _os.path.join('data', 'sales', 'q1_2024.csv')
assert r == expected, f"Expected '{expected}', got '{r}'"
assert _os.path.exists(r), "The resulting path should actually exist on disk"
print("✓ Path:", r)
`,
    hint: '`os.path.join(part1, part2, part3)` — pass as many parts as you need.',
    xp: 10
  },

  {
    id: 'path-002', unit: 'Working with Paths', unitId: 'unit2', order: 2,
    title: 'Just the filename', emoji: '🏷️',
    description: `When you have a full path like \`/workspace/data/sales/q1_2024.csv\`, you often just need the filename at the end.

**Task:** Extract just the filename from the path below. Store in \`result\`.`,
    context: '`os` is available. `full_path` is pre-set.',
    starterCode: `import os

full_path = "/workspace/data/sales/q1_2024.csv"

# Extract just the filename
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the filename to 'result'"
assert _ns['result'] == 'q1_2024.csv', f"Expected 'q1_2024.csv', got '{_ns['result']}'"
print("✓ Filename:", _ns['result'])
`,
    hint: '`os.path.basename(path)` returns the last component of a path.',
    xp: 10
  },

  {
    id: 'path-003', unit: 'Working with Paths', unitId: 'unit2', order: 3,
    title: 'Just the folder', emoji: '📁',
    description: `The opposite — you have a full path and need just the **directory** part.

**Task:** Extract the directory from \`/workspace/data/sales/q1_2024.csv\`. Store in \`result\`.`,
    context: '`os` is available. `full_path` is pre-set.',
    starterCode: `import os

full_path = "/workspace/data/sales/q1_2024.csv"

# Extract the directory part
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the directory to 'result'"
assert _ns['result'] == '/workspace/data/sales', f"Expected '/workspace/data/sales', got '{_ns['result']}'"
print("✓ Directory:", _ns['result'])
`,
    hint: '`os.path.dirname(path)` returns everything except the final component.',
    xp: 10
  },

  {
    id: 'path-004', unit: 'Working with Paths', unitId: 'unit2', order: 4,
    title: 'Name vs extension', emoji: '✂️',
    description: `Splitting a filename into its stem and extension is very common — e.g. to add a suffix like \`q1_2024_cleaned.csv\`.

**Task:** Split \`"q1_2024.csv"\` into its name and extension. Store them in \`name\` and \`ext\`.

Expected: \`name = "q1_2024"\` and \`ext = ".csv"\``,
    context: '`os` is available.',
    starterCode: `import os

filename = "q1_2024.csv"

# Split into stem and extension
name, ext = `,
    setup: '',
    test: `
assert 'name' in _ns and 'ext' in _ns, "You need both 'name' and 'ext' variables"
assert _ns['name'] == 'q1_2024', f"Expected name='q1_2024', got '{_ns['name']}'"
assert _ns['ext'] == '.csv', f"Expected ext='.csv', got '{_ns['ext']}'"
print(f"✓ name='{_ns['name']}', ext='{_ns['ext']}'")
`,
    hint: '`os.path.splitext(filename)` returns a tuple `(stem, extension)`. You can unpack it directly: `name, ext = os.path.splitext(...)`',
    xp: 15
  },

  {
    id: 'path-005', unit: 'Working with Paths', unitId: 'unit2', order: 5,
    title: 'pathlib: find all CSVs', emoji: '🔦',
    description: `\`pathlib\` is the modern, object-oriented way to handle paths. Many data engineers prefer it over \`os.path\`.

**Task:** Use \`pathlib.Path\` to find all \`.csv\` files anywhere inside \`data/\`. Store a list in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `from pathlib import Path

# Find all .csv files anywhere inside data/
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = list(_ns['result'])
assert len(r) == 2, f"Expected 2 CSV files, found {len(r)}"
assert all(str(p).endswith('.csv') for p in r), "All items should be .csv files"
print("✓ Found:", [p.name for p in r])
`,
    hint: '`Path("data").rglob("*.csv")` searches recursively. Wrap in `list()` to get a list.',
    xp: 15
  },

  {
    id: 'path-006', unit: 'Working with Paths', unitId: 'unit2', order: 6,
    title: 'Build an output path', emoji: '🏗️',
    description: `Classic data pipeline pattern: read from one folder, write results to another — same filename, different location.

**Task:** Given \`input_path = "data/sales/q1_2024.csv"\` and \`output_dir = "data/reports"\`, build the output path that puts the **same filename** into \`output_dir\`. Store in \`result\`.

Expected result: \`data/reports/q1_2024.csv\``,
    context: '`os` is available.',
    starterCode: `import os

input_path = "data/sales/q1_2024.csv"
output_dir = "data/reports"

# Build: same filename, different folder
result = `,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "Assign the output path to 'result'"
r = str(_ns['result']).replace('\\\\', '/')
expected = 'data/reports/q1_2024.csv'
assert r == expected, f"Expected '{expected}', got '{r}'"
print("✓ Output path:", r)
`,
    hint: 'Use `os.path.basename(input_path)` to get the filename, then `os.path.join(output_dir, filename)` to build the new path.',
    xp: 20
  },

  // ════════════════════════════════════════════════════════════
  //  UNIT 3 — Reading & Writing Files
  // ════════════════════════════════════════════════════════════

  {
    id: 'io-001', unit: 'Reading & Writing Files', unitId: 'unit3', order: 1,
    title: 'Read a text file', emoji: '📖',
    description: `The most fundamental file operation. Python's \`with open()\` pattern automatically closes the file even if something goes wrong.

**Task:** Read the full contents of \`data/reports/summary.txt\` into a string called \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `# Read data/reports/summary.txt into a string called result
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the file contents to 'result'"
r = _ns['result']
assert isinstance(r, str), "result should be a string"
assert 'Q1' in r, "The file should contain 'Q1'"
assert 'Q2' in r, "The file should contain 'Q2'"
assert len(r) > 20, "result looks too short — did you read the full file?"
print(f"✓ Read {len(r)} characters")
`,
    hint: '```python\nwith open("data/reports/summary.txt") as f:\n    result = f.read()\n```',
    xp: 10
  },

  {
    id: 'io-002', unit: 'Reading & Writing Files', unitId: 'unit3', order: 2,
    title: 'Count log lines', emoji: '🔢',
    description: `Log files can get huge. Quickly counting lines tells you how much data you're dealing with.

**Task:** Count how many lines are in \`logs/app.log\`. Store the count in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `# Count the number of lines in logs/app.log
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the count to 'result'"
r = _ns['result']
assert isinstance(r, int), f"result should be an integer, got {type(r).__name__}"
with open('/workspace/logs/app.log') as _f:
    expected = len(_f.readlines())
assert r == expected, f"Expected {expected} lines, got {r}"
print(f"✓ {r} lines in app.log")
`,
    hint: '`f.readlines()` returns a list of lines — `len()` of that list is your count. Or: `sum(1 for _ in f)`.',
    xp: 15
  },

  {
    id: 'io-003', unit: 'Reading & Writing Files', unitId: 'unit3', order: 3,
    title: 'Read a CSV properly', emoji: '📊',
    description: `Don't parse CSVs manually — the \`csv\` module handles quoted fields, commas in values, and encodings correctly.

**Task:** Read \`data/sales/q1_2024.csv\` using \`csv.DictReader\`. Store a **list of dicts** (one per data row, not the header) in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import csv

result = []
with open("data/sales/q1_2024.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # append each row to result
        `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 3, f"Expected 3 data rows (not the header), got {len(r)}"
assert 'revenue' in r[0], "Each row should have a 'revenue' key"
assert 'product' in r[0], "Each row should have a 'product' key"
assert 'date' in r[0], "Each row should have a 'date' key"
print(f"✓ Read {len(r)} rows. First:", dict(r[0]))
`,
    hint: 'Inside the `for row in reader:` loop, call `result.append(row)` to collect each row.',
    xp: 20
  },

  {
    id: 'io-004', unit: 'Reading & Writing Files', unitId: 'unit3', order: 4,
    title: 'Parse a JSON config', emoji: '⚙️',
    description: `Config files are almost always JSON. This is something you'll do in nearly every real script.

**Task:** Load \`config.json\` and extract the value of the \`"version"\` key. Store it in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import json

# Load config.json and get the "version" value
result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the version value to 'result'"
assert _ns['result'] == "2.1", f"Expected '2.1', got '{_ns['result']}'"
print("✓ Version:", _ns['result'])
`,
    hint: '```python\nwith open("config.json") as f:\n    config = json.load(f)\nresult = config["version"]\n```',
    xp: 15
  },

  {
    id: 'io-005', unit: 'Reading & Writing Files', unitId: 'unit3', order: 5,
    title: 'Write a result file', emoji: '💾',
    description: `Your analysis is done. Now save the result.

**Task:** Write the string \`"Analysis complete: 42 records processed"\` to a new file called \`output.txt\`. Then read it back and store the contents in \`result\` to verify.`,
    context: 'You are in `/workspace`.',
    starterCode: `# Write to output.txt, then read it back into result
with open("output.txt", "w") as f:
    f.write(  )  # fill in the string

# Read it back to verify
with open("output.txt") as f:
    result = f.read()`,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "result should contain the file contents you read back"
r = _ns['result']
assert 'Analysis complete' in r, "File should contain 'Analysis complete'"
assert '42' in r, "File should contain '42'"
assert _os.path.exists('/workspace/output.txt'), "output.txt should exist on disk"
print("✓ File written and verified:", r.strip())
`,
    hint: 'Inside the write block: `f.write("Analysis complete: 42 records processed")`',
    xp: 15
  },

  {
    id: 'io-006', unit: 'Reading & Writing Files', unitId: 'unit3', order: 6,
    title: 'Append to a log', emoji: '📝',
    description: `Opening a file with \`"w"\` overwrites it. Use \`"a"\` to **append** without losing what's already there.

**Task:** Append the line \`"2024-03-01 12:00 INFO Script finished"\` to \`logs/app.log\`, then read the whole file and count the total lines. Store the count in \`result\`.`,
    context: 'You are in `/workspace`. The log currently has 3 lines.',
    starterCode: `# Append a new line to logs/app.log
with open("logs/app.log", "a") as f:
    f.write(  )  # write the new line (remember \\n at the end)

# Read back and count total lines
with open("logs/app.log") as f:
    result = `,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the total line count to 'result'"
r = _ns['result']
assert isinstance(r, int), f"result should be an integer, got {type(r).__name__}"
assert r == 4, f"Expected 4 lines after appending, got {r}"
with open('/workspace/logs/app.log') as _f:
    content = _f.read()
assert 'Script finished' in content, "The appended line should be in the file"
print(f"✓ Log now has {r} lines")
`,
    hint: 'Use `"a"` mode to append. Don\'t forget `\\n` at the end of your string, or the next line won\'t start on a new line.',
    xp: 20
  },

];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id) || null;
}

function getChallengesByUnit(unitId) {
  return CHALLENGES.filter(c => c.unitId === unitId).sort((a, b) => a.order - b.order);
}

function getNextChallenge(currentId) {
  const c = getChallengeById(currentId);
  if (!c) return null;
  const unitChallenges = getChallengesByUnit(c.unitId);
  const idx = unitChallenges.findIndex(x => x.id === currentId);
  return unitChallenges[idx + 1] || null;
}

// ── SRS (SM-2 variant) ────────────────────────────────────────────────────────
// grade: 0=fail, 1=tricky, 2=got it, 3=easy
function srsKey(id) { return 'prog_ch_' + id; }

function getSRS(id) {
  const raw = localStorage.getItem(srsKey(id));
  return raw ? JSON.parse(raw) : { reps: 0, interval: 0, ease: 2.5, nextDue: 0, done: false };
}

function applySRS(id, grade) {
  const s = getSRS(id);
  s.done = true;
  s.lastDone = Date.now();
  if (grade === 0) {
    s.interval = 1; s.reps = 0;
  } else {
    s.reps += 1;
    if (s.reps === 1)      s.interval = 1;
    else if (s.reps === 2) s.interval = 3;
    else                   s.interval = Math.round(s.interval * s.ease);
    if (grade === 3) s.interval = Math.round(s.interval * 1.3);
    s.ease = Math.max(1.3, s.ease + (grade === 1 ? -0.15 : grade === 3 ? 0.1 : 0));
  }
  s.nextDue = Date.now() + s.interval * 86400000;
  localStorage.setItem(srsKey(id), JSON.stringify(s));
  return s;
}

function getUnitStats(unitId) {
  const challenges = getChallengesByUnit(unitId);
  const now = Date.now();
  let done = 0, due = 0;
  challenges.forEach(c => {
    const s = getSRS(c.id);
    if (s.done) { done++; if (s.nextDue <= now) due++; }
  });
  return { total: challenges.length, done, due };
}
