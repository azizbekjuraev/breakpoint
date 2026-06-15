import type * as TS from 'typescript';
import type { RunResult, TestFailure } from '@/lib/types';

import lib_es5 from 'typescript/lib/lib.es5.d.ts?raw';
import lib_es2015 from 'typescript/lib/lib.es2015.d.ts?raw';
import lib_es2015_core from 'typescript/lib/lib.es2015.core.d.ts?raw';
import lib_es2015_collection from 'typescript/lib/lib.es2015.collection.d.ts?raw';
import lib_es2015_generator from 'typescript/lib/lib.es2015.generator.d.ts?raw';
import lib_es2015_iterable from 'typescript/lib/lib.es2015.iterable.d.ts?raw';
import lib_es2015_promise from 'typescript/lib/lib.es2015.promise.d.ts?raw';
import lib_es2015_proxy from 'typescript/lib/lib.es2015.proxy.d.ts?raw';
import lib_es2015_reflect from 'typescript/lib/lib.es2015.reflect.d.ts?raw';
import lib_es2015_symbol from 'typescript/lib/lib.es2015.symbol.d.ts?raw';
import lib_es2015_symbol_wellknown from 'typescript/lib/lib.es2015.symbol.wellknown.d.ts?raw';
import lib_es2016 from 'typescript/lib/lib.es2016.d.ts?raw';
import lib_es2016_array_include from 'typescript/lib/lib.es2016.array.include.d.ts?raw';
import lib_es2017 from 'typescript/lib/lib.es2017.d.ts?raw';
import lib_es2017_object from 'typescript/lib/lib.es2017.object.d.ts?raw';
import lib_es2017_string from 'typescript/lib/lib.es2017.string.d.ts?raw';
import lib_es2017_intl from 'typescript/lib/lib.es2017.intl.d.ts?raw';
import lib_es2017_sharedmemory from 'typescript/lib/lib.es2017.sharedmemory.d.ts?raw';
import lib_es2017_typedarrays from 'typescript/lib/lib.es2017.typedarrays.d.ts?raw';
import lib_es2017_date from 'typescript/lib/lib.es2017.date.d.ts?raw';
import lib_es2017_arraybuffer from 'typescript/lib/lib.es2017.arraybuffer.d.ts?raw';

const LIB_DIR = '/__lib__/';
const USER_FILE = '/main.ts';

const LIB_FILES: Record<string, string> = {
  'lib.es5.d.ts': lib_es5,
  'lib.es2015.d.ts': lib_es2015,
  'lib.es2015.core.d.ts': lib_es2015_core,
  'lib.es2015.collection.d.ts': lib_es2015_collection,
  'lib.es2015.generator.d.ts': lib_es2015_generator,
  'lib.es2015.iterable.d.ts': lib_es2015_iterable,
  'lib.es2015.promise.d.ts': lib_es2015_promise,
  'lib.es2015.proxy.d.ts': lib_es2015_proxy,
  'lib.es2015.reflect.d.ts': lib_es2015_reflect,
  'lib.es2015.symbol.d.ts': lib_es2015_symbol,
  'lib.es2015.symbol.wellknown.d.ts': lib_es2015_symbol_wellknown,
  'lib.es2016.d.ts': lib_es2016,
  'lib.es2016.array.include.d.ts': lib_es2016_array_include,
  'lib.es2017.d.ts': lib_es2017,
  'lib.es2017.object.d.ts': lib_es2017_object,
  'lib.es2017.string.d.ts': lib_es2017_string,
  'lib.es2017.intl.d.ts': lib_es2017_intl,
  'lib.es2017.sharedmemory.d.ts': lib_es2017_sharedmemory,
  'lib.es2017.typedarrays.d.ts': lib_es2017_typedarrays,
  'lib.es2017.date.d.ts': lib_es2017_date,
  'lib.es2017.arraybuffer.d.ts': lib_es2017_arraybuffer,
};

export interface TsDiagnostic {
  line: number;
  col: number;
  code: number;
  message: string;
}

let tsModule: typeof TS | null = null;
async function loadTs(): Promise<typeof TS> {
  if (!tsModule) {
    tsModule = (await import('typescript')) as unknown as typeof TS;
  }
  return tsModule;
}

interface CompileCache {
  files: Map<string, TS.SourceFile>;
}

function basename(p: string): string {
  const i = p.lastIndexOf('/');
  return i === -1 ? p : p.slice(i + 1);
}

function diagnose(ts: typeof TS, code: string, cache: CompileCache): TsDiagnostic[] {
  const userSource = ts.createSourceFile(USER_FILE, code, ts.ScriptTarget.ES2017, true);

  const host: TS.CompilerHost = {
    getSourceFile: (fileName, languageVersionOrOptions) => {
      if (fileName === USER_FILE) return userSource;
      const base = basename(fileName);
      if (LIB_FILES[base]) {
        let sf = cache.files.get(fileName);
        if (!sf) {
          sf = ts.createSourceFile(fileName, LIB_FILES[base], languageVersionOrOptions, true);
          cache.files.set(fileName, sf);
        }
        return sf;
      }
      return undefined;
    },
    getDefaultLibFileName: () => `${LIB_DIR}lib.es2017.d.ts`,
    writeFile: () => {},
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    fileExists: (fileName) => {
      if (fileName === USER_FILE) return true;
      return basename(fileName) in LIB_FILES;
    },
    readFile: (fileName) => {
      if (fileName === USER_FILE) return code;
      return LIB_FILES[basename(fileName)];
    },
    getCanonicalFileName: (n) => n,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
    resolveModuleNameLiterals: () => [],
  };

  const program = ts.createProgram({
    rootNames: [USER_FILE],
    options: {
      target: ts.ScriptTarget.ES2017,
      lib: [`${LIB_DIR}lib.es2017.d.ts`],
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      types: [],
      noImplicitAny: true,
      strictNullChecks: true,
    },
    host,
  });

  const sourceFile = program.getSourceFile(USER_FILE)!;
  const all: TS.Diagnostic[] = [
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ];

  return all.map((d) => {
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    let line = 0;
    let col = 0;
    if (d.file && d.start !== undefined) {
      const lc = d.file.getLineAndCharacterOfPosition(d.start);
      line = lc.line + 1;
      col = lc.character + 1;
    }
    return { line, col, code: d.code, message };
  });
}

function formatDiag(d: TsDiagnostic): string {
  return `line ${d.line}:${d.col} TS${d.code}: ${d.message}`;
}

function sameDiag(a: TsDiagnostic, b: TsDiagnostic): boolean {
  return a.line === b.line && a.col === b.col && a.code === b.code && a.message === b.message;
}

function diff(after: TsDiagnostic[], before: TsDiagnostic[]): TsDiagnostic[] {
  const consumed = new Set<number>();
  const extras: TsDiagnostic[] = [];
  for (const d of after) {
    let matched = -1;
    for (let i = 0; i < before.length; i++) {
      if (!consumed.has(i) && sameDiag(d, before[i])) {
        matched = i;
        break;
      }
    }
    if (matched >= 0) consumed.add(matched);
    else extras.push(d);
  }
  return extras;
}

interface ErrorMatcher {
  code?: number;
  match?: RegExp | string;
  line?: number;
}

function matcherFits(matcher: ErrorMatcher | undefined, diags: TsDiagnostic[]): TsDiagnostic | null {
  if (diags.length === 0) return null;
  if (!matcher) return diags[0];
  for (const d of diags) {
    if (matcher.code !== undefined && d.code !== matcher.code) continue;
    if (matcher.line !== undefined && d.line !== matcher.line) continue;
    if (matcher.match !== undefined) {
      const re = matcher.match instanceof RegExp ? matcher.match : new RegExp(matcher.match);
      if (!re.test(d.message)) continue;
    }
    return d;
  }
  return null;
}

export async function runTsTests(userCode: string, testsSrc: string): Promise<RunResult> {
  const start =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  const ts = await loadTs();
  const cache: CompileCache = { files: new Map() };

  const logs: string[] = [];
  const errors: string[] = [];
  const failures: TestFailure[] = [];
  const tests: Array<{ name: string; fn: () => void | Promise<void> }> = [];

  let baseDiagnostics: TsDiagnostic[] = [];
  try {
    baseDiagnostics = diagnose(ts, userCode, cache);
  } catch (e) {
    errors.push('TypeScript compile crashed: ' + (e instanceof Error ? e.message : String(e)));
    return {
      passed: false,
      total: 0,
      passedCount: 0,
      failures: [],
      logs,
      errors,
      durationMs: 0,
    };
  }

  const userLineCount = userCode.split('\n').length;

  function compileWithSnippet(snippet: string): TsDiagnostic[] {
    const combined = userCode + '\n;{\n' + snippet + '\n}\n';
    return diagnose(ts, combined, cache);
  }

  const assert = {
    ok(cond: unknown, msg?: string) {
      if (!cond) throw new Error(msg ?? `Expected truthy, got ${String(cond)}`);
    },
    equal(a: unknown, b: unknown, msg?: string) {
      if (a !== b) {
        throw new Error(msg ?? `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
      }
    },
  };

  function assertNoErrors() {
    if (baseDiagnostics.length > 0) {
      const summary = baseDiagnostics
        .slice(0, 3)
        .map(formatDiag)
        .join(' | ');
      const more =
        baseDiagnostics.length > 3 ? ` (+${baseDiagnostics.length - 3} more)` : '';
      throw new Error(
        `Expected no type errors, got ${baseDiagnostics.length}: ${summary}${more}`,
      );
    }
  }

  function assertHasError(matcher?: ErrorMatcher) {
    const hit = matcherFits(matcher, baseDiagnostics);
    if (!hit) {
      if (baseDiagnostics.length === 0) {
        throw new Error('Expected a type error in your code, but it compiled cleanly');
      }
      throw new Error(
        `Expected a type error matching ${JSON.stringify(matcher)}, got: ${baseDiagnostics
          .map(formatDiag)
          .join(' | ')}`,
      );
    }
  }

  function assertTypechecks(snippet: string) {
    const after = compileWithSnippet(snippet);
    const introduced = diff(after, baseDiagnostics);
    if (introduced.length > 0) {
      const summary = introduced.slice(0, 3).map(formatDiag).join(' | ');
      throw new Error(`Snippet was expected to typecheck, but produced: ${summary}`);
    }
  }

  function assertTypeError(snippet: string, matcher?: ErrorMatcher) {
    const after = compileWithSnippet(snippet);
    const introduced = diff(after, baseDiagnostics);
    if (introduced.length === 0) {
      throw new Error('Expected snippet to produce a type error, but it typechecked cleanly');
    }
    const adjustedMatcher = matcher
      ? {
          ...matcher,
          line: matcher.line !== undefined ? matcher.line + userLineCount + 1 : undefined,
        }
      : undefined;
    const hit = matcherFits(adjustedMatcher, introduced);
    if (!hit) {
      throw new Error(
        `Expected error matching ${JSON.stringify(matcher)}, got: ${introduced
          .map(formatDiag)
          .join(' | ')}`,
      );
    }
  }

  function getErrors(): TsDiagnostic[] {
    return baseDiagnostics.map((d) => ({ ...d }));
  }

  function test(name: string, fn: () => void | Promise<void>) {
    tests.push({ name, fn });
  }

  function log(...args: unknown[]) {
    logs.push(
      args
        .map((a) => {
          if (typeof a === 'string') return a;
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(' '),
    );
  }

  try {
    const runner = new Function(
      'test',
      'assert',
      'assertNoErrors',
      'assertHasError',
      'assertTypechecks',
      'assertTypeError',
      'getErrors',
      'log',
      testsSrc,
    );
    runner(
      test,
      assert,
      assertNoErrors,
      assertHasError,
      assertTypechecks,
      assertTypeError,
      getErrors,
      log,
    );
  } catch (e) {
    errors.push('Error loading tests: ' + (e instanceof Error ? e.message : String(e)));
  }

  for (const t of tests) {
    try {
      const r = t.fn();
      if (r && typeof (r as Promise<unknown>).then === 'function') await r;
    } catch (e) {
      failures.push({
        name: t.name,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const end =
    typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

  return {
    passed: failures.length === 0 && tests.length > 0,
    total: tests.length,
    passedCount: tests.length - failures.length,
    failures,
    logs,
    errors,
    durationMs: Math.round(end - start),
  };
}
