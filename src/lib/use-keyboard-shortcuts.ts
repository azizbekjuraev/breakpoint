import { useEffect, useRef } from 'react';

export type ShortcutHandler = (e: KeyboardEvent) => void;

export interface ShortcutSpec {
  /**
   * Key sequence:
   *   - `'Mod+Enter'` — Cmd on mac, Ctrl elsewhere
   *   - `'?'` — single key
   *   - `'g h'` — chord: press `g`, then `h` within the timeout
   */
  keys: string;
  handler: ShortcutHandler;
  /**
   * When `false` (the default), the shortcut is suppressed if focus is inside
   * a text input, textarea, contenteditable element, or a CodeMirror editor.
   * Set `true` for shortcuts that should fire from the editor (e.g. Cmd+Enter
   * to run tests).
   */
  allowInEditor?: boolean;
  /**
   * When set, the shortcut still fires from inside an editor but only if it
   * uses a modifier key (Cmd / Ctrl / Alt). The default is to require this.
   */
  requireModifierInEditor?: boolean;
  /** Skip preventDefault even when the shortcut matches. */
  passthrough?: boolean;
}

const CHORD_TIMEOUT_MS = 700;

interface ParsedKey {
  type: 'combo' | 'chord' | 'plain';
  /** For 'combo' / 'plain': the single trigger. */
  trigger?: { key: string; mod: boolean; alt: boolean; shift: boolean };
  /** For 'chord': sequence of single keys, lowercased. */
  steps?: string[];
}

function parseKeys(spec: string): ParsedKey {
  const trimmed = spec.trim();
  if (trimmed.includes(' ')) {
    return {
      type: 'chord',
      steps: trimmed.split(/\s+/).map((k) => k.toLowerCase()),
    };
  }
  if (trimmed.includes('+')) {
    const parts = trimmed.split('+').map((p) => p.trim());
    const key = parts[parts.length - 1].toLowerCase();
    const mods = parts.slice(0, -1).map((m) => m.toLowerCase());
    return {
      type: 'combo',
      trigger: {
        key,
        mod: mods.includes('mod') || mods.includes('cmd') || mods.includes('ctrl'),
        alt: mods.includes('alt') || mods.includes('option'),
        shift: mods.includes('shift'),
      },
    };
  }
  return {
    type: 'plain',
    trigger: {
      key: trimmed.toLowerCase(),
      mod: false,
      alt: false,
      shift: false,
    },
  };
}

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLElement && el.isContentEditable) return true;
  // CodeMirror 6 places focus on a contenteditable .cm-content node; walk up
  // in case `.cm-editor` is the ancestor that's focused via tabindex.
  if (el.closest && el.closest('.cm-editor')) return true;
  return false;
}

function normalizeEventKey(e: KeyboardEvent): string {
  // `e.key` already reflects layout / shift; lowercase to match parsed specs.
  // For `?`, e.key is `'?'` directly when shift is held. We don't normalize
  // away the shift state — see matchesCombo.
  if (e.key === ' ') return 'space';
  return e.key.toLowerCase();
}

function comboMatches(
  e: KeyboardEvent,
  trigger: NonNullable<ParsedKey['trigger']>,
): boolean {
  const expectMod = trigger.mod;
  const expectAlt = trigger.alt;
  const expectShift = trigger.shift;
  const hasMod = e.metaKey || e.ctrlKey;
  if (expectMod !== hasMod) return false;
  if (expectAlt !== e.altKey) return false;
  if (expectShift && !e.shiftKey) return false;
  // Don't enforce !shift for the shift case — `?` is shift+/ on US layout, but
  // e.key already resolves to '?'. We allow extra shift if the key already
  // requires it.
  return normalizeEventKey(e) === trigger.key;
}

export function useKeyboardShortcuts(shortcuts: ShortcutSpec[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    let chordPrefix: { key: string; expires: number } | null = null;

    function clearChord() {
      chordPrefix = null;
    }

    function onKeyDown(e: KeyboardEvent) {
      const inEditor = isTypingTarget(document.activeElement);
      const list = shortcutsRef.current;

      // First try chord shortcuts when a prefix is armed.
      if (chordPrefix) {
        if (chordPrefix.expires < Date.now()) {
          clearChord();
        } else {
          const second = normalizeEventKey(e);
          for (const spec of list) {
            if (spec.allowInEditor !== true && inEditor) continue;
            const parsed = parseKeys(spec.keys);
            if (parsed.type !== 'chord' || !parsed.steps) continue;
            if (parsed.steps.length !== 2) continue;
            if (parsed.steps[0] !== chordPrefix.key) continue;
            if (parsed.steps[1] !== second) continue;
            if (!spec.passthrough) e.preventDefault();
            spec.handler(e);
            clearChord();
            return;
          }
          // Second keypress didn't satisfy any chord — drop the prefix and
          // fall through so the user's intended single shortcut can still run.
          clearChord();
        }
      }

      // Modifier combos and single keys.
      for (const spec of list) {
        const parsed = parseKeys(spec.keys);
        if (parsed.type === 'chord') continue;
        if (!parsed.trigger) continue;

        const isModCombo = parsed.trigger.mod || parsed.trigger.alt;
        if (inEditor && !spec.allowInEditor && !isModCombo) continue;
        // Even when allowInEditor is true, plain-letter shortcuts inside the
        // editor would steal keystrokes from the user's typing.
        if (inEditor && spec.allowInEditor && !isModCombo) continue;

        if (comboMatches(e, parsed.trigger)) {
          if (!spec.passthrough) e.preventDefault();
          spec.handler(e);
          return;
        }
      }

      // Did any chord shortcut share this key as its prefix? Arm the chord.
      const key = normalizeEventKey(e);
      const hasMod = e.metaKey || e.ctrlKey || e.altKey;
      if (hasMod) return; // Modifier-prefixed chords aren't supported.
      if (inEditor) return;
      for (const spec of list) {
        const parsed = parseKeys(spec.keys);
        if (parsed.type !== 'chord' || !parsed.steps) continue;
        if (parsed.steps[0] !== key) continue;
        chordPrefix = { key, expires: Date.now() + CHORD_TIMEOUT_MS };
        e.preventDefault();
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}

export function shortcutLabel(spec: string): string {
  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
  return spec
    .split(' ')
    .map((part) =>
      part
        .split('+')
        .map((piece) => {
          const p = piece.toLowerCase();
          if (p === 'mod') return isMac ? '⌘' : 'Ctrl';
          if (p === 'cmd') return '⌘';
          if (p === 'ctrl') return 'Ctrl';
          if (p === 'alt' || p === 'option') return isMac ? '⌥' : 'Alt';
          if (p === 'shift') return '⇧';
          if (p === 'enter') return '↵';
          if (p === 'escape') return 'Esc';
          if (p.length === 1) return p.toUpperCase();
          return piece;
        })
        .join(isMac ? '' : '+'),
    )
    .join(' then ');
}
