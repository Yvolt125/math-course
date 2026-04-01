// ── Virtual filesystem set up before every challenge run ─────────────────────
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

// ── NumPy sample data (injected as per-challenge setup) ───────────────────────
const NUMPY_SETUP = `
import numpy as np

# Monthly sales data (Jan-Dec, in $)
sales = np.array([1500, 960, 400, 2000, 1280, 450, 1750, 1120, 350, 1900, 1240, 425])
months = np.arange(1, 13)

# Monthly average temperatures (Celsius)
temps = np.array([3.2, 4.1, 8.7, 14.3, 19.8, 24.1, 26.5, 25.9, 21.2, 15.4, 8.6, 4.2])

# Student test scores: 5 students x 3 tests
scores = np.array([
    [78, 85, 92],
    [65, 72, 88],
    [90, 95, 97],
    [55, 61, 70],
    [82, 79, 85],
])
`;

// ── Pandas sample data (injected as per-challenge setup) ─────────────────────
const PANDAS_SETUP = `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'month':   ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    'region':  ['North','North','North','South','South','South','East','East','East','West','West','West'],
    'product': ['A','B','C','A','B','C','A','B','C','A','B','C'],
    'units':   [150, 120, 80, 200, 160, 90, 175, 140, 70, 190, 155, 85],
    'revenue': [1500, 960, 400, 2000, 1280, 450, 1750, 1120, 350, 1900, 1240, 425],
})

df_products = pd.DataFrame({
    'product':  ['A', 'B', 'C'],
    'category': ['Electronics', 'Clothing', 'Food'],
    'cost':     [8.0, 5.5, 3.2],
})
`;

// ── Challenge data ────────────────────────────────────────────────────────────
const CHALLENGES = [

  // ════════════════════════════════════════════════════════════
  //  OS · UNIT 1 — File System Basics
  // ════════════════════════════════════════════════════════════

  {
    id: 'fs-001', unit: 'File System Basics', unitId: 'unit1', order: 1,
    title: 'Workspace snapshot', emoji: '📍',
    description: `Before any script starts, confirm your working directory and check that expected folders are present.

**Task:** Get the current working directory and check whether the \`logs\` directory exists. Store a dict in \`result\` with keys \`"cwd"\` (string) and \`"has_logs"\` (bool).`,
    context: 'You are in `/workspace`. Import `os` to get started.',
    starterCode: `import os

# Get the current working directory
cwd = None  # YOUR CODE HERE

# Check whether the 'logs' directory exists (True/False)
has_logs = None  # YOUR CODE HERE

result = {"cwd": cwd, "has_logs": has_logs}`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert isinstance(r, dict), "result should be a dict"
assert r.get('cwd') == '/workspace', f"cwd should be '/workspace', got '{r.get('cwd')}'"
assert r.get('has_logs') is True, "has_logs should be True"
print("OK cwd:", r['cwd'], "| has_logs:", r['has_logs'])
`,
    hint: '`os.getcwd()` returns the current path. `os.path.isdir(name)` returns True/False for directories.',
    xp: 15
  },

  {
    id: 'fs-002', unit: 'File System Basics', unitId: 'unit1', order: 2,
    title: 'Files vs folders', emoji: '📂',
    description: `\`os.listdir()\` returns files and folders mixed together. Real scripts often need to handle them differently.

**Task:** List the current directory and split entries into two sorted lists — one for files, one for directories. Store a dict in \`result\` with keys \`"files"\` and \`"dirs"\`.`,
    context: 'You are in `/workspace`. There are 2 dirs (`data`, `logs`) and 1 file (`config.json`).',
    starterCode: `import os

entries = os.listdir(".")

files = []  # filter entries to files only (os.path.isfile), then sort
dirs  = []  # filter entries to dirs only (os.path.isdir), then sort

result = {"files": files, "dirs": dirs}`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert 'config.json' in r.get('files', []), "config.json should be in 'files'"
assert 'data' in r.get('dirs', []), "'data' should be in 'dirs'"
assert 'logs' in r.get('dirs', []), "'logs' should be in 'dirs'"
assert 'data' not in r.get('files', []), "'data' should not appear in 'files'"
print("OK files:", r['files'], "| dirs:", r['dirs'])
`,
    hint: '`os.path.isfile(e)` and `os.path.isdir(e)` test each entry. Use list comprehensions to filter, then `sorted()` to sort.',
    xp: 20
  },

  {
    id: 'fs-003', unit: 'File System Basics', unitId: 'unit1', order: 3,
    title: 'Find all CSVs recursively', emoji: '🔍',
    description: `In real projects CSV files are scattered across subdirectories. You need to find all of them from the workspace root.

**Task:** Walk the entire workspace recursively and collect all files ending in \`.csv\`. Store a **sorted** list of their **full absolute paths** in \`result\`.`,
    context: 'You are in `/workspace`. CSVs live inside `data/sales/`.',
    starterCode: `import os

result = []
for folder, subfolders, files in os.walk("."):
    for f in files:
        if f.endswith(".csv"):
            pass  # append the full absolute path to result

result = sorted(result)`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 2, f"Expected 2 CSV files, found {len(r)}"
assert all('/workspace' in p for p in r), "Paths should be absolute (contain /workspace)"
assert all(p.endswith('.csv') for p in r), "All entries should end in .csv"
assert r == sorted(r), "List should be sorted"
print("OK Found:", [p.split('/')[-1] for p in r])
`,
    hint: '`os.walk(".")` yields `(root, dirs, files)`. Build full path with `os.path.abspath(os.path.join(root, f))`. Filter by `f.endswith(".csv")`.',
    xp: 20
  },

  {
    id: 'fs-004', unit: 'File System Basics', unitId: 'unit1', order: 4,
    title: 'Extract error lines', emoji: '🚨',
    description: `Log files mix info, warnings, and errors. A common first task is isolating just the error lines.

**Task:** Read \`logs/app.log\` and return a list of lines (stripped of whitespace) that contain the word \`"ERROR"\`. Store in \`result\`.`,
    context: 'You are in `/workspace`. The log has 3 lines; 1 contains "ERROR".',
    starterCode: `result = []

with open("logs/app.log") as f:
    for line in f:
        pass  # if "ERROR" in line, append line.strip() to result`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 1, f"Expected 1 ERROR line, found {len(r)}"
assert 'ERROR' in r[0], "The line should contain 'ERROR'"
assert 'Connection timeout' in r[0], "Should contain the error message"
print("OK Error lines:", r)
`,
    hint: 'Open the file with `with open(...) as f:`, iterate lines, use `if "ERROR" in line:` and `line.strip()`.',
    xp: 20
  },

  {
    id: 'fs-005', unit: 'File System Basics', unitId: 'unit1', order: 5,
    title: 'Largest file in data/', emoji: '📏',
    description: `Before loading data, know which file is biggest — so you can decide whether to stream or chunk.

**Task:** Find the largest file by size (in bytes) anywhere inside \`data/\`. Store a tuple \`(filename, size_in_bytes)\` in \`result\`, where filename is just the basename.`,
    context: 'You are in `/workspace`. Search recursively inside `data/`.',
    starterCode: `import os

largest_name = None
largest_size = -1

for folder, _, files in os.walk("data"):
    for f in files:
        path = os.path.join(folder, f)
        size = None  # get file size using os.path.getsize(path)
        # if size > largest_size, update both variables

result = (largest_name, largest_size)`,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "Assign the tuple to 'result'"
r = _ns['result']
assert isinstance(r, tuple) and len(r) == 2, "result should be a (filename, size) tuple"
name, size = r
assert isinstance(name, str), "filename should be a string"
assert isinstance(size, int) and size > 0, "size should be a positive integer"
all_sizes = {}
for root, _, files in _os.walk('/workspace/data'):
    for f in files:
        p = _os.path.join(root, f)
        all_sizes[f] = _os.path.getsize(p)
assert size == max(all_sizes.values()), f"Expected size {max(all_sizes.values())}, got {size}"
print(f"OK Largest: {name} ({size} bytes)")
`,
    hint: 'Track `largest_name` and `largest_size`. Update whenever `os.path.getsize(path) > largest_size`.',
    xp: 25
  },

  {
    id: 'fs-006', unit: 'File System Basics', unitId: 'unit1', order: 6,
    title: 'File inventory', emoji: '📋',
    description: `Data pipelines often start with "what have I got?" — a structured inventory of files by folder.

**Task:** Walk \`data/\` and build a dict mapping each **direct subfolder name** to a **sorted list of filenames** in it. Store in \`result\`.

Expected: \`{"reports": ["notes.txt", "summary.txt"], "sales": ["q1_2024.csv", "q2_2024.csv"]}\``,
    context: 'You are in `/workspace`. Only look one level deep inside `data/`.',
    starterCode: `import os

result = {}

for name in sorted(os.listdir("data")):
    path = os.path.join("data", name)
    if os.path.isdir(path):
        pass  # map name → sorted list of filenames in that directory`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert isinstance(r, dict), "result should be a dict"
assert set(r.keys()) == {'reports', 'sales'}, f"Expected keys 'reports' and 'sales', got {set(r.keys())}"
assert sorted(r['sales']) == ['q1_2024.csv', 'q2_2024.csv'], f"sales wrong: {r['sales']}"
assert sorted(r['reports']) == ['notes.txt', 'summary.txt'], f"reports wrong: {r['reports']}"
print("OK Inventory:", r)
`,
    hint: '`os.listdir("data")` gives the subfolders. For each one that is a dir, call `os.listdir()` again.',
    xp: 25
  },

  // ════════════════════════════════════════════════════════════
  //  OS · UNIT 2 — Working with Paths
  // ════════════════════════════════════════════════════════════

  {
    id: 'path-001', unit: 'Working with Paths', unitId: 'unit2', order: 1,
    title: 'Dissect a path list', emoji: '🔬',
    description: `When processing a batch of files you often need to split each path into directory, stem, and extension — so you can manipulate them separately.

**Task:** Given the list \`paths\` below, build a list of tuples \`(directory, stem, extension)\` for each path. Store in \`result\`.`,
    context: '`os` and `os.path` are available.',
    starterCode: `import os

paths = [
    "data/sales/q1_2024.csv",
    "data/reports/summary.txt",
    "logs/app.log",
]

result = []
for p in paths:
    directory = None  # directory part of the path
    name      = None  # filename without extension
    ext       = None  # extension (e.g. ".csv")
    result.append((directory, name, ext))`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list) and len(r) == 3, "result should have 3 tuples"
assert r[0] == ('data/sales', 'q1_2024', '.csv'), f"First tuple wrong: {r[0]}"
assert r[1] == ('data/reports', 'summary', '.txt'), f"Second tuple wrong: {r[1]}"
assert r[2] == ('logs', 'app', '.log'), f"Third tuple wrong: {r[2]}"
print("OK Dissected:", r)
`,
    hint: '`os.path.dirname(p)` → dir; `os.path.splitext(os.path.basename(p))` → (stem, ext). Append as tuple.',
    xp: 20
  },

  {
    id: 'path-002', unit: 'Working with Paths', unitId: 'unit2', order: 2,
    title: 'Build batch output paths', emoji: '🏗️',
    description: `A pipeline reads CSVs from \`data/sales/\` and writes results to \`data/reports/\` — same filename, different folder, with \`"_processed"\` added before the extension.

**Task:** Given the list \`input_paths\`, generate the corresponding output paths. Store in \`result\`.

Example: \`"data/sales/q1_2024.csv"\` → \`"data/reports/q1_2024_processed.csv"\``,
    context: '`os` is available.',
    starterCode: `import os

input_paths = [
    "data/sales/q1_2024.csv",
    "data/sales/q2_2024.csv",
]

result = []
for p in input_paths:
    stem = None  # basename without extension
    ext  = None  # extension
    out_name = None  # stem + "_processed" + ext
    result.append(None)  # os.path.join("data/reports", out_name)`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = [str(x) for x in _ns['result']]
assert len(r) == 2, f"Expected 2 output paths, got {len(r)}"
assert 'q1_2024_processed.csv' in r[0], f"First path wrong: {r[0]}"
assert 'q2_2024_processed.csv' in r[1], f"Second path wrong: {r[1]}"
assert all('reports' in p for p in r), "All paths should go into reports/"
print("OK Output paths:", r)
`,
    hint: '`os.path.splitext(basename)` → (stem, ext). Build `stem + "_processed" + ext`, then `os.path.join("data/reports", new_name)`.',
    xp: 20
  },

  {
    id: 'path-003', unit: 'Working with Paths', unitId: 'unit2', order: 3,
    title: 'Group files by extension', emoji: '🗃️',
    description: `A quick way to survey a directory tree: group all files by extension so you instantly see "2 CSVs, 2 TXTs, 1 JSON, 1 LOG."

**Task:** Using \`pathlib\`, walk the entire workspace and build a dict mapping each **extension** (e.g. \`".csv"\`) to a **sorted list of filenames** with that extension. Store in \`result\`.`,
    context: 'You are in `/workspace`. Use `pathlib.Path`.',
    starterCode: `from pathlib import Path

result = {}
for p in Path(".").rglob("*"):
    if p.is_file():
        ext = p.suffix
        if ext not in result:
            result[ext] = []
        pass  # append p.name to result[ext]

for ext in result:
    result[ext] = sorted(result[ext])`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert isinstance(r, dict), "result should be a dict"
assert '.csv' in r, "Should have a '.csv' key"
assert '.txt' in r, "Should have a '.txt' key"
assert '.json' in r, "Should have a '.json' key"
assert '.log' in r, "Should have a '.log' key"
assert sorted(r['.csv']) == ['q1_2024.csv', 'q2_2024.csv'], f"CSV files wrong: {r['.csv']}"
assert 'config.json' in r['.json'], f"JSON files wrong: {r['.json']}"
print("OK Extensions:", {k: len(v) for k, v in r.items()})
`,
    hint: '`Path(".").rglob("*")` yields all paths recursively. `.is_file()` skips dirs. `.suffix` gives the extension.',
    xp: 20
  },

  {
    id: 'path-004', unit: 'Working with Paths', unitId: 'unit2', order: 4,
    title: 'Validate a file list', emoji: '✅',
    description: `Input paths often come from config or user input — some may be wrong. Always validate before processing.

**Task:** Given \`candidates\` below, return only the paths that point to **actual existing files** (not directories, not missing). Store in \`result\`.`,
    context: 'You are in `/workspace`.',
    starterCode: `import os

candidates = [
    "data/sales/q1_2024.csv",
    "data/sales/missing.csv",   # does not exist
    "data",                      # is a directory
    "config.json",
    "data/reports/summary.txt",
]

result = []  # keep only paths that are real existing files (not dirs, not missing)`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 3, f"Expected 3 valid files, got {len(r)}: {r}"
assert "data/sales/q1_2024.csv" in r
assert "config.json" in r
assert "data/reports/summary.txt" in r
assert "data/sales/missing.csv" not in r, "missing.csv should be excluded"
assert "data" not in r, "directories should be excluded"
print("OK Valid files:", r)
`,
    hint: '`os.path.isfile(p)` returns True only for paths that exist AND are regular files.',
    xp: 15
  },

  {
    id: 'path-005', unit: 'Working with Paths', unitId: 'unit2', order: 5,
    title: 'Text files: stem to size', emoji: '📝',
    description: `A common audit: check all text files and report their sizes. With \`pathlib\` you can chain this cleanly.

**Task:** Using \`pathlib.Path\`, find all \`.txt\` files anywhere in the workspace. Build a dict mapping each file's **stem** (name without extension) to its **size in bytes**. Store in \`result\`.`,
    context: 'You are in `/workspace`. There are 2 txt files: `summary.txt` and `notes.txt`.',
    starterCode: `from pathlib import Path

result = {}
for p in Path(".").rglob("*.txt"):
    pass  # map p.stem → file size in bytes (p.stat().st_size)`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert isinstance(r, dict), "result should be a dict"
assert 'summary' in r, "Should have 'summary' key"
assert 'notes' in r, "Should have 'notes' key"
assert isinstance(r['summary'], int) and r['summary'] > 0, "summary size should be a positive int"
assert isinstance(r['notes'], int) and r['notes'] > 0, "notes size should be a positive int"
print("OK Text files:", r)
`,
    hint: '`Path(".").rglob("*.txt")` finds all txt files. `.stem` gives name without extension; `.stat().st_size` gives size in bytes.',
    xp: 20
  },

  {
    id: 'path-006', unit: 'Working with Paths', unitId: 'unit2', order: 6,
    title: 'Unique parent directories', emoji: '📁',
    description: `When you receive a flat list of file paths, knowing which directories contain them helps you set up output folders or check permissions.

**Task:** Given \`file_paths\` below, extract the **unique set of parent directories** as strings. Store a **sorted list** in \`result\`.`,
    context: '`os` is available.',
    starterCode: `import os

file_paths = [
    "data/sales/q1_2024.csv",
    "data/sales/q2_2024.csv",
    "data/reports/summary.txt",
    "data/reports/notes.txt",
    "logs/app.log",
]

dirs = set()
for p in file_paths:
    pass  # add the parent directory of p to dirs

result = sorted(dirs)`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign your list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a list"
assert len(r) == 3, f"Expected 3 unique dirs, got {len(r)}: {r}"
assert 'data/sales' in r
assert 'data/reports' in r
assert 'logs' in r
assert r == sorted(r), "List should be sorted"
print("OK Unique dirs:", r)
`,
    hint: 'Use a `set()` to collect unique values, then `sorted()`. `os.path.dirname(p)` extracts the directory.',
    xp: 20
  },

  // ════════════════════════════════════════════════════════════
  //  OS · UNIT 3 — Reading & Writing Files
  // ════════════════════════════════════════════════════════════

  {
    id: 'io-001', unit: 'Reading & Writing Files', unitId: 'unit3', order: 1,
    title: 'Total Q1 revenue', emoji: '💰',
    description: `You've been handed a quarterly sales CSV. The first job: compute total revenue.

**Task:** Read \`data/sales/q1_2024.csv\` using the \`csv\` module. Sum all values in the \`revenue\` column (they're strings — convert to \`int\`). Store the total in \`result\`.`,
    context: 'You are in `/workspace`. The CSV has columns: date, product, revenue.',
    starterCode: `import csv

total = 0
with open("data/sales/q1_2024.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        pass  # add int(row["revenue"]) to total

result = total`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the total to 'result'"
r = _ns['result']
assert isinstance(r, int), f"result should be an int, got {type(r).__name__}"
assert r == 2550, f"Expected 2550, got {r}"
print(f"OK Q1 revenue: {r}")
`,
    hint: '`csv.DictReader(f)` gives each row as a dict. `int(row["revenue"])` converts the string. Sum them all.',
    xp: 20
  },

  {
    id: 'io-002', unit: 'Reading & Writing Files', unitId: 'unit3', order: 2,
    title: 'Filter errors to new file', emoji: '🚨',
    description: `Log processing often starts by splitting by severity into separate files.

**Task:**
1. Read \`logs/app.log\`
2. Find all lines containing \`"ERROR"\`
3. Write those lines to \`logs/errors.log\`
4. Store the **count of error lines written** in \`result\``,
    context: 'You are in `/workspace`. The main log has 3 lines; 1 is an ERROR.',
    starterCode: `error_lines = []

with open("logs/app.log") as f:
    for line in f:
        pass  # if "ERROR" in line, append line to error_lines

with open("logs/errors.log", "w") as f:
    pass  # write all error_lines to the file

result = len(error_lines)`,
    setup: '',
    test: `
import os as _os
assert 'result' in _ns, "Assign the count to 'result'"
r = _ns['result']
assert isinstance(r, int)
assert r == 1, f"Expected 1 error line, got {r}"
assert _os.path.exists('/workspace/logs/errors.log'), "errors.log should exist"
with open('/workspace/logs/errors.log') as _f:
    content = _f.read()
assert 'ERROR' in content, "errors.log should contain ERROR"
assert 'Connection timeout' in content, "Should contain the error message"
print(f"OK {r} error(s) written to errors.log")
`,
    hint: 'Collect ERROR lines into a list, write with `f.writelines(error_lines)`. Count with `len(error_lines)`.',
    xp: 25
  },

  {
    id: 'io-003', unit: 'Reading & Writing Files', unitId: 'unit3', order: 3,
    title: 'Best product across quarters', emoji: '🏆',
    description: `Two quarterly CSVs, same format. Combine them and find the top product by total revenue.

**Task:**
1. Read both \`data/sales/q1_2024.csv\` and \`data/sales/q2_2024.csv\`
2. Accumulate total revenue per product across both files
3. Store the **name of the highest-revenue product** in \`result\``,
    context: 'You are in `/workspace`.',
    starterCode: `import csv

totals = {}

for filename in ["data/sales/q1_2024.csv", "data/sales/q2_2024.csv"]:
    with open(filename) as f:
        for row in csv.DictReader(f):
            product = row["product"]
            revenue = int(row["revenue"])
            pass  # accumulate: totals[product] += revenue

result = None  # name of the highest-revenue product`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the product name to 'result'"
r = _ns['result']
assert isinstance(r, str), "result should be a string"
assert r == "Widget A", f"Expected 'Widget A' (total 2550), got '{r}'"
print(f"OK Best product: {r}")
`,
    hint: 'Use a dict: `totals[product] = totals.get(product, 0) + revenue`. Then `max(totals, key=totals.get)` gives the winner.',
    xp: 30
  },

  {
    id: 'io-004', unit: 'Reading & Writing Files', unitId: 'unit3', order: 4,
    title: 'Update and save config', emoji: '⚙️',
    description: `Config files need updating over time. The pattern: load → modify → write back.

**Task:**
1. Load \`config.json\`
2. Set \`"debug"\` to \`True\` and \`"version"\` to \`"3.0"\`
3. Write the updated config back to \`config.json\`
4. Read it again and store the resulting dict in \`result\``,
    context: 'You are in `/workspace`.',
    starterCode: `import json

with open("config.json") as f:
    config = json.load(f)

# Set "debug" to True and "version" to "3.0"


with open("config.json", "w") as f:
    pass  # write updated config back using json.dump

with open("config.json") as f:
    result = None  # load and return the saved config`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the loaded config to 'result'"
r = _ns['result']
assert isinstance(r, dict)
assert r.get('debug') is True, f"'debug' should be True, got {r.get('debug')}"
assert r.get('version') == "3.0", f"'version' should be '3.0', got {r.get('version')}"
assert r.get('max_files') == 100, "Other fields should be preserved"
print("OK Config updated:", r)
`,
    hint: 'Load with `json.load()`, modify the dict, write back with `json.dump(config, f)`. Read again to verify.',
    xp: 25
  },

  {
    id: 'io-005', unit: 'Reading & Writing Files', unitId: 'unit3', order: 5,
    title: 'Parse a text report', emoji: '📑',
    description: `Text reports are everywhere. Extracting structured numbers from them is a core skill.

**Task:** Read \`data/reports/summary.txt\`. Find the line containing \`"Q1 Total Revenue:"\` and extract the number at the end. Store it as an **integer** in \`result\`.`,
    context: 'You are in `/workspace`. Q1 revenue is 2550.',
    starterCode: `result = None

with open("data/reports/summary.txt") as f:
    for line in f:
        if "Q1 Total Revenue:" in line:
            pass  # extract the number after ":" and store as int in result
            break`,
    setup: '',
    test: `
assert 'result' in _ns, "Assign the revenue value to 'result'"
r = _ns['result']
assert r is not None, "result should not be None — did you find the Q1 line?"
assert isinstance(r, int), f"result should be an int, got {type(r).__name__}"
assert r == 2550, f"Expected 2550, got {r}"
print(f"OK Q1 Revenue: {r}")
`,
    hint: '`line.strip().split(":")[-1].strip()` gets the part after the colon. Wrap in `int()` to convert.',
    xp: 25
  },

  {
    id: 'io-006', unit: 'Reading & Writing Files', unitId: 'unit3', order: 6,
    title: 'Write a summary CSV', emoji: '💾',
    description: `After processing, write a clean summary CSV with only the columns you need.

**Task:**
1. Read \`data/sales/q1_2024.csv\` using \`csv.DictReader\`
2. Write \`data/reports/q1_summary.csv\` with only two columns: \`product\` and \`revenue\`
3. Store the **number of data rows written** (excluding header) in \`result\``,
    context: 'You are in `/workspace`. The Q1 CSV has 3 data rows.',
    starterCode: `import csv

rows = []
with open("data/sales/q1_2024.csv") as f:
    for row in csv.DictReader(f):
        pass  # append {"product": ..., "revenue": ...} to rows

with open("data/reports/q1_summary.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["product", "revenue"])
    writer.writeheader()
    pass  # write all rows using writer.writerows(rows)

result = len(rows)`,
    setup: '',
    test: `
import csv as _csv, os as _os
assert 'result' in _ns, "Assign the row count to 'result'"
r = _ns['result']
assert isinstance(r, int)
assert r == 3, f"Expected 3 rows, got {r}"
assert _os.path.exists('/workspace/data/reports/q1_summary.csv'), "q1_summary.csv should exist"
with open('/workspace/data/reports/q1_summary.csv') as _f:
    written = list(_csv.DictReader(_f))
assert len(written) == 3, f"CSV should have 3 data rows"
assert 'product' in written[0] and 'revenue' in written[0]
assert 'date' not in written[0], "Should NOT have 'date' column"
print(f"OK Wrote {r} rows to q1_summary.csv")
`,
    hint: '`csv.DictWriter(f, fieldnames=["product","revenue"])` — call `.writeheader()` then `.writerows(rows)`.',
    xp: 30
  },

  // ════════════════════════════════════════════════════════════
  //  NUMPY · UNIT 1 — Array Fundamentals
  // ════════════════════════════════════════════════════════════

  {
    id: 'np-001', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 1,
    title: 'Sales statistics', emoji: '📊',
    description: `The first thing you do with a new dataset: compute basic summary statistics in one pass.

**Task:** Using the \`sales\` array (12 months of revenue), compute **mean**, **std**, **min**, and **max**. Round each to 2 decimal places. Store a dict with those four keys in \`result\`.`,
    context: '`numpy as np` and the `sales` array are already loaded.',
    starterCode: `result = {
    "mean": None,  # np.mean(sales), rounded to 2 dp
    "std":  None,  # np.std(sales), rounded to 2 dp
    "min":  None,  # np.min(sales), rounded to 2 dp
    "max":  None,  # np.max(sales), rounded to 2 dp
}`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns, "Assign the dict to 'result'"
r = _ns['result']
assert abs(r['mean'] - 1031.25) < 0.01, f"mean wrong: {r['mean']}"
assert abs(r['std']  - float(np.std(sales))) < 1.0, f"std wrong: {r['std']}"
assert r['min'] == 350.0, f"min wrong: {r['min']}"
assert r['max'] == 2000.0, f"max wrong: {r['max']}"
print("OK Stats:", r)
`,
    hint: '`np.mean()`, `np.std()`, `np.min()`, `np.max()` — wrap each in `float()` then `round(..., 2)`.',
    xp: 20
  },

  {
    id: 'np-002', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 2,
    title: 'High-temperature months', emoji: '🌡️',
    description: `Boolean masking lets you filter array data in one expression — no loops needed.

**Task:** Using \`temps\` (monthly temperatures) and \`months\` (1–12), find the **month numbers** where temperature exceeds 20°C. Store as a Python **list of integers** in \`result\`.`,
    context: '`numpy as np`, `temps`, and `months` are already loaded.',
    starterCode: `mask = None  # boolean mask: temps > 20
result = None  # use mask to filter months, then .tolist()`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns, "Assign the list to 'result'"
r = _ns['result']
assert isinstance(r, list), "result should be a Python list"
assert r == [6, 7, 8, 9], f"Expected [6, 7, 8, 9], got {r}"
print("OK Hot months:", r)
`,
    hint: 'Create a boolean mask with `temps > 20`, then index `months` with it: `months[mask]`. Use `.tolist()` to convert.',
    xp: 20
  },

  {
    id: 'np-003', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 3,
    title: 'Score averages', emoji: '🎓',
    description: `The \`scores\` array holds 5 students × 3 tests. You need both the per-student average and the per-test average.

**Task:** Compute:
- \`student_avg\`: mean for each student (axis=1), rounded to 1 decimal
- \`test_avg\`: mean for each test (axis=0), rounded to 1 decimal

Store a dict with those two keys (each a list) in \`result\`.`,
    context: '`numpy as np` and `scores` (5×3 array) are already loaded.',
    starterCode: `student_avg = None  # mean per student (axis=1), rounded to 1 dp, as list
test_avg    = None  # mean per test (axis=0), rounded to 1 dp, as list

result = {"student_avg": student_avg, "test_avg": test_avg}`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
sa = r['student_avg']
ta = r['test_avg']
assert len(sa) == 5, f"student_avg should have 5 values"
assert len(ta) == 3, f"test_avg should have 3 values"
assert abs(sa[0] - 85.0) < 0.1, f"Student 0 avg should be 85.0, got {sa[0]}"
assert abs(sa[2] - 94.0) < 0.1, f"Student 2 avg should be 94.0, got {sa[2]}"
assert abs(ta[0] - 74.0) < 0.1, f"Test 0 avg should be 74.0, got {ta[0]}"
print("OK Student avgs:", sa)
print("OK Test avgs:", ta)
`,
    hint: '`np.mean(scores, axis=1)` averages across columns (per student). `np.mean(scores, axis=0)` averages across rows (per test).',
    xp: 25
  },

  {
    id: 'np-004', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 4,
    title: 'Min-max normalisation', emoji: '📐',
    description: `Before feeding data into ML models, normalise to [0, 1] using: \`(x - min) / (max - min)\`.

**Task:** Normalise the \`sales\` array to the [0, 1] range. Round each value to 4 decimal places. Store the result as a NumPy array in \`result\`.`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `min_val = None  # minimum value in sales
max_val = None  # maximum value in sales

result = None  # (sales - min_val) / (max_val - min_val), rounded to 4 dp`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert len(r) == 12, "Should have 12 values"
assert abs(float(r.min()) - 0.0) < 0.001, "Min of normalised array should be 0.0"
assert abs(float(r.max()) - 1.0) < 0.001, "Max of normalised array should be 1.0"
# sales[0]=1500, min=350, max=2000 → (1500-350)/(2000-350) = 1150/1650 ≈ 0.6970
assert abs(float(r[0]) - 0.6970) < 0.001, f"First value wrong: {float(r[0])}"
print("OK Normalised (first 4):", r[:4].tolist())
`,
    hint: '`(sales - sales.min()) / (sales.max() - sales.min())` — NumPy broadcasts this across the whole array.',
    xp: 25
  },

  {
    id: 'np-005', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 5,
    title: 'Stack arrays side by side', emoji: '🪢',
    description: `You have two parallel 1D arrays that belong together. \`np.column_stack()\` combines them into a 2D array.

**Task:** Stack \`months\` and \`temps\` side by side into a 2D array with shape \`(12, 2)\` — column 0 is month number, column 1 is temperature. Store in \`result\`.`,
    context: '`numpy as np`, `months` (1–12), and `temps` (12 floats) are already loaded.',
    starterCode: `result = None  # stack months and temps side by side into a (12, 2) array`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert r.shape == (12, 2), f"Expected shape (12, 2), got {r.shape}"
assert float(r[0, 0]) == 1.0, f"First month should be 1"
assert abs(float(r[0, 1]) - 3.2) < 0.01, f"First temp should be 3.2"
assert float(r[6, 0]) == 7.0, f"Month 7 should be in row 6"
print("OK Shape:", r.shape, "| First row:", r[0].tolist())
`,
    hint: '`np.column_stack((months, temps))` creates a 2D array where each input becomes a column.',
    xp: 20
  },

  {
    id: 'np-006', unit: 'NumPy · Array Fundamentals', unitId: 'numpy1', order: 6,
    title: 'Top 3 sales months', emoji: '🏅',
    description: `You want to know **which months** had the best sales — their original indices, not just the values.

**Task:** Find the indices of the **top 3 highest sales months** in descending order of sales. Store as a Python list of integers in \`result\`.`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `# argsort gives ascending order; reverse to get descending
result = None  # list of 3 indices of the highest-sales months`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 3, f"Expected list of 3 indices"
# sales = [1500,960,400,2000,1280,450,1750,1120,350,1900,1240,425]
# Top 3: 2000(idx3), 1900(idx9), 1750(idx6)
assert r[0] == 3, f"Highest is index 3 (2000), got {r[0]}"
assert r[1] == 9, f"Second is index 9 (1900), got {r[1]}"
assert r[2] == 6, f"Third is index 6 (1750), got {r[2]}"
print("OK Top 3 month indices:", r)
`,
    hint: '`np.argsort(sales)` gives ascending order indices. `[::-1]` reverses to descending. `[:3]` takes the top 3.',
    xp: 25
  },

  // ════════════════════════════════════════════════════════════
  //  NUMPY · UNIT 2 — Real Analysis
  // ════════════════════════════════════════════════════════════

  {
    id: 'np-007', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 1,
    title: 'Classify sales performance', emoji: '🏷️',
    description: `\`np.where()\` is the vectorised if/else — applies a condition across an entire array at once, no loop needed.

**Task:** Create an array where each element is \`"high"\` if that month's sales exceed the mean, otherwise \`"low"\`. Store as a Python list in \`result\`.`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `mean_sales = np.mean(sales)
result = None  # "high" where sales > mean_sales else "low", as a Python list`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 12
# mean = 1031.25
# high: 1500(0),2000(3),1280(4),1750(6),1120(7),1900(9),1240(10)
high_indices = {0, 3, 4, 6, 7, 9, 10}
for i, label in enumerate(r):
    expected = "high" if i in high_indices else "low"
    assert label == expected, f"Index {i}: expected '{expected}', got '{label}'"
print("OK Labels:", r)
`,
    hint: '`np.where(condition, "high", "low")` — no loop needed. Use `.tolist()` to get a Python list.',
    xp: 25
  },

  {
    id: 'np-008', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 2,
    title: 'Handle missing data', emoji: '🕳️',
    description: `Real data often has missing values as \`NaN\`. NumPy's \`nan*\` functions ignore them gracefully.

**Task:** Given \`data_with_nans\`, compute:
- \`"clean_mean"\`: mean ignoring NaN values (use \`np.nanmean\`), rounded to 2 dp
- \`"valid_count"\`: number of non-NaN values

Store a dict with those keys in \`result\`.`,
    context: '`numpy as np` is already loaded.',
    starterCode: `import numpy as np

data_with_nans = np.array([10.0, np.nan, 30.0, np.nan, 50.0, 20.0, np.nan, 40.0])

clean_mean  = None  # mean ignoring NaN (np.nanmean), rounded to 2 dp
valid_count = None  # count of non-NaN values

result = {"clean_mean": clean_mean, "valid_count": valid_count}`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert abs(r['clean_mean'] - 30.0) < 0.01, f"clean_mean should be 30.0, got {r['clean_mean']}"
assert r['valid_count'] == 5, f"valid_count should be 5, got {r['valid_count']}"
print("OK Result:", r)
`,
    hint: '`np.nanmean()` skips NaNs. `np.isnan(arr)` gives a boolean mask; `~` inverts it; `np.sum()` counts Trues.',
    xp: 25
  },

  {
    id: 'np-009', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 3,
    title: 'Outlier detection', emoji: '📡',
    description: `A simple outlier rule: flag values more than 2 standard deviations from the mean.

**Task:** Using \`sales\`, find the **indices** of months where the absolute z-score exceeds 2. Store as a Python list of integers in \`result\`. (If none, store an empty list.)`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `mean = np.mean(sales)
std  = np.std(sales)

z_scores = None  # absolute z-scores: np.abs((sales - mean) / std)
result = None  # list of indices where z_scores > 2`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list), "result should be a Python list"
# sales std ≈ 585. No month exceeds 2 std from mean (max z ≈ 1.65).
assert r == [], f"No month exceeds 2 std — expected [], got {r}"
print("OK Outliers (>2 std):", r if r else "none found")
`,
    hint: 'Z-score = `(x - mean) / std`. `np.abs()` for absolute value. `np.where(z_scores > 2)[0]` gives the indices.',
    xp: 25
  },

  {
    id: 'np-010', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 4,
    title: '3-month rolling average', emoji: '📈',
    description: `Rolling averages smooth noisy data and reveal trends. With NumPy, use \`np.convolve()\`.

**Task:** Compute a 3-month rolling average of \`sales\`. Store the result as a list of floats **rounded to 2 dp**, starting from index 2 (i.e. the first window covering months 1–3). The list should have **10 values**.`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `window = 3
kernel = None  # np.ones(window) / window

rolling = None  # np.convolve(sales, kernel, mode='valid')
result = None  # [round(float(v), 2) for v in rolling]`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 10, f"Expected 10 values, got {len(r)}"
# Window [1500,960,400] → 2860/3 = 953.33
assert abs(r[0] - 953.33) < 0.1, f"First rolling avg should be 953.33, got {r[0]}"
# Window [960,400,2000] → 3360/3 = 1120.0
assert abs(r[1] - 1120.0) < 0.1, f"Second rolling avg should be 1120.0, got {r[1]}"
print("OK Rolling averages:", r)
`,
    hint: '`np.convolve(sales, np.ones(3)/3, mode="valid")` gives the 3-month rolling average. `mode="valid"` excludes edges, giving `len(sales)-2 = 10` values.',
    xp: 30
  },

  {
    id: 'np-011', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 5,
    title: 'Correlation coefficient', emoji: '🔗',
    description: `Does temperature predict sales? The Pearson correlation ranges from -1 (perfect inverse) to +1 (perfect positive).

**Task:** Compute the Pearson correlation coefficient between \`sales\` and \`temps\`. Store it as a float rounded to 4 decimal places in \`result\`.`,
    context: '`numpy as np`, `sales`, and `temps` are already loaded.',
    starterCode: `corr_matrix = None  # np.corrcoef(sales, temps)
result = None  # correlation at [0, 1], rounded to 4 dp`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, float), f"result should be a float"
assert -1.0 <= r <= 1.0, "Correlation must be between -1 and 1"
expected = round(float(np.corrcoef(sales, temps)[0, 1]), 4)
assert abs(r - expected) < 0.001, f"Expected {expected}, got {r}"
print(f"OK Correlation (sales vs temps): {r}")
`,
    hint: '`np.corrcoef(a, b)` returns a 2×2 matrix. The correlation is at `[0, 1]`.',
    xp: 25
  },

  {
    id: 'np-012', unit: 'NumPy · Real Analysis', unitId: 'numpy2', order: 6,
    title: 'Z-score normalisation', emoji: '📉',
    description: `Z-score standardisation transforms data to **mean = 0, std = 1**. Formula: \`z = (x - mean) / std\`.

**Task:** Z-score normalise the \`sales\` array. Round each value to 4 decimal places. Store as a Python list in \`result\`.`,
    context: '`numpy as np` and `sales` are already loaded.',
    starterCode: `mean = np.mean(sales)
std  = np.std(sales)

z = None  # (sales - mean) / std, rounded to 4 dp
result = None  # convert z to a Python list`,
    setup: NUMPY_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 12
import numpy as _np
arr = _np.array(r)
assert abs(float(arr.mean())) < 0.001, f"Mean of z-scored array should be ~0, got {float(arr.mean())}"
assert abs(float(arr.std()) - 1.0) < 0.01, f"Std should be ~1, got {float(arr.std())}"
print("OK Z-scores (first 4):", [round(v,2) for v in r[:4]])
`,
    hint: 'Z-score = `(sales - np.mean(sales)) / np.std(sales)`. NumPy broadcasts automatically. `.tolist()` converts.',
    xp: 25
  },

  // ════════════════════════════════════════════════════════════
  //  PANDAS · UNIT 1 — DataFrame Basics
  // ════════════════════════════════════════════════════════════

  {
    id: 'pd-001', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 1,
    title: 'Inspect the DataFrame', emoji: '🔎',
    description: `When you first receive a dataset, the standard move is to check its shape and column types.

**Task:** Using \`df\`, build a dict with:
- \`"shape"\`: a tuple \`(rows, cols)\`
- \`"dtypes"\`: a dict mapping column name → dtype as a string

Store in \`result\`.`,
    context: '`pandas as pd` and `df` (12 rows × 5 cols) are already loaded.',
    starterCode: `shape  = None  # df.shape gives (rows, cols)
dtypes = None  # {col: str(dtype) for col, dtype in df.dtypes.items()}

result = {"shape": shape, "dtypes": dtypes}`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert r['shape'] == (12, 5), f"Shape wrong: {r['shape']}"
assert isinstance(r['dtypes'], dict)
assert set(r['dtypes'].keys()) == {'month', 'region', 'product', 'units', 'revenue'}
assert 'int' in r['dtypes']['units'].lower(), f"units should be int dtype, got {r['dtypes']['units']}"
print("OK Shape:", r['shape'], "| Dtypes:", r['dtypes'])
`,
    hint: '`df.shape` gives a `(rows, cols)` tuple. `df.dtypes` is a Series — convert with `{col: str(dtype) for col, dtype in df.dtypes.items()}`.',
    xp: 20
  },

  {
    id: 'pd-002', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 2,
    title: 'Filter high-revenue rows', emoji: '💸',
    description: `Boolean indexing filters rows with a single expression — no loops.

**Task:** Filter \`df\` to rows where \`revenue\` > 1000. Store the **count of matching rows** in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `filtered = None  # df rows where revenue > 1000
result = None  # count of matching rows`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, int), "result should be an int"
# revenues > 1000: 1500,2000,1280,1750,1120,1900,1240 = 7 rows
assert r == 7, f"Expected 7 rows with revenue > 1000, got {r}"
print(f"OK {r} rows with revenue > 1000")
`,
    hint: '`df[df["revenue"] > 1000]` selects matching rows. `len()` counts them.',
    xp: 20
  },

  {
    id: 'pd-003', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 3,
    title: 'Revenue per unit', emoji: '📈',
    description: `Adding computed columns is one of the most common pandas operations.

**Task:**
1. Add a column \`"revenue_per_unit"\` = \`revenue / units\`, rounded to 2 dp
2. Sort by it **descending**
3. Store the **top 3 product names** as a Python list in \`result\``,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `df["revenue_per_unit"] = None  # revenue / units, rounded to 2 dp

top3 = None  # sort by revenue_per_unit descending, take top 3 rows
result = None  # list of product names from top3`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 3, f"Expected list of 3"
# rev/unit: A=10.0, B=8.0, C=5.0 — top 3 are all product A rows
assert r.count('A') >= 1, "Product A should appear (highest rev/unit)"
assert 'C' not in r, "Product C has the lowest rev/unit, should not appear"
print("OK Top 3 by revenue/unit:", r)
`,
    hint: '`df["new"] = (df["a"] / df["b"]).round(2)` adds the column. Then `sort_values(..., ascending=False).head(3)["product"].tolist()`.',
    xp: 25
  },

  {
    id: 'pd-004', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 4,
    title: 'Revenue by region', emoji: '🌍',
    description: `\`groupby\` is one of pandas' most powerful features — split into groups, aggregate, combine.

**Task:** Group \`df\` by \`"region"\` and compute the **total revenue** per region. Store a plain Python dict mapping region → total revenue in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `grouped = None  # groupby "region", sum "revenue"
result = None  # convert grouped Series to a plain Python dict`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, dict)
assert set(r.keys()) == {'North', 'South', 'East', 'West'}
assert r['North'] == 2860, f"North wrong: {r['North']}"  # 1500+960+400
assert r['South'] == 3730, f"South wrong: {r['South']}"  # 2000+1280+450
assert r['East']  == 3220, f"East wrong: {r['East']}"    # 1750+1120+350
assert r['West']  == 3565, f"West wrong: {r['West']}"    # 1900+1240+425
print("OK Revenue by region:", r)
`,
    hint: '`df.groupby("region")["revenue"].sum()` gives a Series. `.to_dict()` converts to plain Python dict.',
    xp: 25
  },

  {
    id: 'pd-005', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 5,
    title: 'Select and rename columns', emoji: '✂️',
    description: `Before sharing data, you often want a clean subset with friendly column names.

**Task:**
1. Select only \`"region"\`, \`"product"\`, \`"revenue"\` from \`df\`
2. Rename them to \`"area"\`, \`"item"\`, \`"sales"\`
3. Store the resulting DataFrame in \`result\``,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `subset = None  # select only "region", "product", "revenue" columns
result = None  # rename them to "area", "item", "sales"`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
import pandas as _pd
r = _ns['result']
assert isinstance(r, _pd.DataFrame), "result should be a DataFrame"
assert list(r.columns) == ['area', 'item', 'sales'], f"Columns wrong: {list(r.columns)}"
assert len(r) == 12, f"Should still have 12 rows"
assert 'region' not in r.columns, "Old 'region' column should be gone"
print("OK Columns:", list(r.columns), "| Shape:", r.shape)
`,
    hint: '`df[["col1","col2","col3"]]` selects columns. `.rename(columns={"old": "new"})` renames them.',
    xp: 20
  },

  {
    id: 'pd-006', unit: 'Pandas · DataFrame Basics', unitId: 'pandas1', order: 6,
    title: 'Multi-condition filter', emoji: '🔀',
    description: `Real queries combine multiple conditions. In pandas use \`&\` (and) and \`|\` (or) with parentheses around each condition.

**Task:** Filter \`df\` to rows where:
- region is \`"North"\` **OR** \`"South"\`
- **AND** revenue > 500

Store the filtered DataFrame in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `mask = None  # (region is "North" or "South") AND (revenue > 500)
result = None  # df filtered by mask`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
import pandas as _pd
r = _ns['result']
assert isinstance(r, _pd.DataFrame)
assert all(r['region'].isin(['North','South'])), "All rows should be North or South"
assert all(r['revenue'] > 500), "All rows should have revenue > 500"
# North: A(1500)✓, B(960)✓, C(400)✗; South: A(2000)✓, B(1280)✓, C(450)✗ → 4 rows
assert len(r) == 4, f"Expected 4 rows, got {len(r)}"
print(f"OK {len(r)} rows match. Revenue range: {r['revenue'].min()}-{r['revenue'].max()}")
`,
    hint: 'Use `.isin(["North","South"])` for region. Combine with `&`: `(condition1) & (condition2)` — each needs parentheses.',
    xp: 25
  },

  // ════════════════════════════════════════════════════════════
  //  PANDAS · UNIT 2 — Data Manipulation
  // ════════════════════════════════════════════════════════════

  {
    id: 'pd-007', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 1,
    title: 'Merge DataFrames', emoji: '🔀',
    description: `Joining tables on a common key is one of the most common data operations. Pandas' \`merge()\` works like SQL JOIN.

**Task:**
1. Merge \`df\` with \`df_products\` on the \`"product"\` column (inner join)
2. Add a \`"total_cost"\` column = \`units × cost\`, rounded to 2 dp
3. Store the **mean** of \`"total_cost"\` across all rows, rounded to 2 dp, in \`result\``,
    context: '`pandas as pd`, `df`, and `df_products` are already loaded.',
    starterCode: `merged = df.merge(df_products, on="product")

merged["total_cost"] = None  # units × cost, rounded to 2 dp
result = None  # mean of "total_cost" column, rounded to 2 dp`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, float), f"result should be a float"
# A costs: 150*8=1200, 200*8=1600, 175*8=1400, 190*8=1520 → 5720
# B costs: 120*5.5=660, 160*5.5=880, 140*5.5=770, 155*5.5=852.5 → 3162.5
# C costs: 80*3.2=256, 90*3.2=288, 70*3.2=224, 85*3.2=272 → 1040
# Total = 9922.5, mean = 9922.5/12 = 826.875
assert abs(r - 826.88) < 0.5, f"Expected ~826.88, got {r}"
print(f"OK Mean total cost: {r}")
`,
    hint: '`df.merge(df_products, on="product")` does inner join. Then `merged["total_cost"] = (merged["units"] * merged["cost"]).round(2)`. `.mean()` on the column.',
    xp: 30
  },

  {
    id: 'pd-008', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 2,
    title: 'Pivot: region × product', emoji: '🔄',
    description: `A pivot table reorganises data so you can read cross-tabulations at a glance.

**Task:** Create a pivot table from \`df\` where rows = \`region\`, columns = \`product\`, values = \`revenue\` (sum). Store the resulting DataFrame in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `result = None  # df.pivot_table(index="region", columns="product", values="revenue", aggfunc="sum")`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
import pandas as _pd
r = _ns['result']
assert isinstance(r, _pd.DataFrame)
assert r.shape == (4, 3), f"Expected (4, 3), got {r.shape}"
assert r.loc['North', 'A'] == 1500, f"North-A wrong: {r.loc['North','A']}"
assert r.loc['South', 'B'] == 1280, f"South-B wrong: {r.loc['South','B']}"
assert r.loc['East',  'C'] == 350,  f"East-C wrong: {r.loc['East','C']}"
print("OK Pivot shape:", r.shape)
print(r.to_string())
`,
    hint: '`df.pivot_table(index="region", columns="product", values="revenue", aggfunc="sum")` — one line.',
    xp: 30
  },

  {
    id: 'pd-009', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 3,
    title: 'Apply a classification', emoji: '⚡',
    description: `\`.apply()\` lets you run a custom function on every row or column value.

**Task:**
1. Add column \`"revenue_tier"\`: \`"Low"\` if revenue < 700, \`"Mid"\` if 700–1499, \`"High"\` if ≥ 1500
2. Count rows per tier. Store a dict \`{"Low": n, "Mid": n, "High": n}\` in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `def classify(rev):
    if rev < 700:
        return "Low"
    elif rev < 1500:
        return "Mid"
    else:
        return "High"

df["revenue_tier"] = None  # apply classify to df["revenue"]
result = None  # value_counts().to_dict()`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, dict)
# Low(<700): 400,450,350,425=4; Mid(700-1499): 960,1280,1120,1240=4; High(>=1500): 1500,2000,1750,1900=4
assert r.get('Low')  == 4, f"Low count wrong: {r.get('Low')}"
assert r.get('Mid')  == 4, f"Mid count wrong: {r.get('Mid')}"
assert r.get('High') == 4, f"High count wrong: {r.get('High')}"
print("OK Tier counts:", r)
`,
    hint: 'Define a classify function, then `df["revenue_tier"] = df["revenue"].apply(classify)`. Then `.value_counts().to_dict()`.',
    xp: 30
  },

  {
    id: 'pd-010', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 4,
    title: 'Multi-metric GroupBy', emoji: '📊',
    description: `\`.agg()\` computes multiple summary statistics in one groupby call.

**Task:** Group \`df\` by \`"product"\` and compute for \`"revenue"\`: \`total\` (sum), \`average\` (mean, rounded to 2 dp), \`count\`. Store a nested dict \`{"A": {"total":…,"average":…,"count":…}, …}\` in \`result\`.`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `grouped = None  # groupby "product", agg revenue: total (sum), average (mean), count

result = None  # grouped.to_dict(orient="index")`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, dict) and set(r.keys()) == {'A','B','C'}
# A: 1500+2000+1750+1900=7150, mean=1787.5, count=4
assert r['A']['total'] == 7150, f"A total wrong: {r['A']['total']}"
assert abs(r['A']['average'] - 1787.5) < 0.1, f"A average wrong: {r['A']['average']}"
assert r['A']['count'] == 4, f"A count wrong: {r['A']['count']}"
# B: 960+1280+1120+1240=4600
assert r['B']['total'] == 4600, f"B total wrong: {r['B']['total']}"
print("OK GroupBy result:", r)
`,
    hint: '`.agg(total="sum", average="mean", count="count")` computes all three. `.to_dict(orient="index")` gives the nested dict.',
    xp: 30
  },

  {
    id: 'pd-011', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 5,
    title: 'Rank within groups', emoji: '🏆',
    description: `"Which product performed best within each region?" — this requires ranking within groups.

**Task:**
1. Add \`"rank_in_region"\`: rank rows by \`revenue\` descending **within each region** (rank 1 = highest)
2. Filter to rank-1 rows
3. Store \`{region: product}\` for the top product per region in \`result\``,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `df["rank_in_region"] = None  # rank revenue descending within each region group

top_per_region = None  # filter to rows where rank_in_region == 1
result = None  # {region: product} dict using zip`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, dict)
assert set(r.keys()) == {'North','South','East','West'}
# In each region, product A has highest revenue
assert r['North'] == 'A', f"North top product wrong: {r['North']}"
assert r['South'] == 'A', f"South top product wrong: {r['South']}"
assert r['East']  == 'A', f"East top product wrong: {r['East']}"
assert r['West']  == 'A', f"West top product wrong: {r['West']}"
print("OK Top product per region:", r)
`,
    hint: '`df.groupby("region")["revenue"].rank(method="dense", ascending=False)` ranks within each group. Then filter to rank == 1.',
    xp: 35
  },

  {
    id: 'pd-012', unit: 'Pandas · Data Manipulation', unitId: 'pandas2', order: 6,
    title: 'Month-over-month change', emoji: '📉',
    description: `Tracking change over time is essential. Pandas' \`.diff()\` computes the difference between consecutive rows.

**Task:**
1. Filter \`df\` to just the \`"North"\` region (3 rows: Jan, Feb, Mar)
2. Compute month-over-month revenue change using \`.diff()\`
3. Store as a Python list of floats in \`result\`. The first element should be \`None\` (no previous month).`,
    context: '`pandas as pd` and `df` are already loaded.',
    starterCode: `north = df[df["region"] == "North"].copy()
changes = None  # north["revenue"].diff()
result = None  # list of floats; first element should be None (NaN → None)`,
    setup: PANDAS_SETUP,
    test: `
assert 'result' in _ns
r = _ns['result']
assert isinstance(r, list) and len(r) == 3, f"Expected list of 3"
assert r[0] is None, f"First element should be None (NaN for first row)"
# North: Jan=1500, Feb=960, Mar=400
# diff: NaN, -540, -560
assert abs(r[1] - (-540.0)) < 0.1, f"Feb change wrong: {r[1]}"
assert abs(r[2] - (-560.0)) < 0.1, f"Mar change wrong: {r[2]}"
print("OK Month-over-month changes:", r)
`,
    hint: '`north["revenue"].diff()` gives differences; first value is NaN. Convert NaN → None with: `None if v != v else float(v)` (NaN is the only value not equal to itself).',
    xp: 30
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
