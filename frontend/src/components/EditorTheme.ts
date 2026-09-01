import type { Monaco } from '@monaco-editor/react'

/**
 * Monaco theme matching the redesign's editor panel: #080d13 body, the gutter
 * numerals at #333d46, strings in the accent, keywords in --color-code-kw.
 */
export const PLAYGROUND_THEME = 'hillol-dark'

export function defineEditorTheme(monaco: Monaco) {
  monaco.editor.defineTheme(PLAYGROUND_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: '8b96a0' },
      { token: 'comment', foreground: '5f6a74', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c3cbd2' },
      { token: 'string', foreground: '34d399' },
      { token: 'string.value.json', foreground: '34d399' },
      { token: 'number', foreground: 'c3cbd2' },
      { token: 'type', foreground: '34d399' },
      { token: 'type.identifier', foreground: '34d399' },
      { token: 'tag', foreground: 'c3cbd2' },
      { token: 'attribute.name', foreground: '8e99a3' },
      { token: 'attribute.value', foreground: '34d399' },
      { token: 'delimiter', foreground: '7c8892' },
    ],
    colors: {
      'editor.background': '#080d13',
      'editor.foreground': '#8b96a0',
      'editorLineNumber.foreground': '#333d46',
      'editorLineNumber.activeForeground': '#5b6570',
      'editorGutter.background': '#080d13',
      'editor.lineHighlightBackground': '#0b1219',
      'editor.lineHighlightBorder': '#00000000',
      'editorCursor.foreground': '#34d399',
      'editor.selectionBackground': '#34d3992e',
      'editor.inactiveSelectionBackground': '#34d39918',
      'editorIndentGuide.background1': '#141b23',
      'editorIndentGuide.activeBackground1': '#1e2831',
      'editorWidget.background': '#0a0f15',
      'editorWidget.border': '#ffffff12',
      'editorSuggestWidget.background': '#0a0f15',
      'scrollbarSlider.background': '#ffffff10',
      'scrollbarSlider.hoverBackground': '#ffffff1c',
      'scrollbarSlider.activeBackground': '#ffffff26',
    },
  })
}
