import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const RichTextEditor = forwardRef(function RichTextEditor(
  {
    value = "",
    onChange,
    font = "editorial",
    theme = "paper",
  },
  ref
) {
  const editorRef = useRef(null);
  const lastHtmlRef = useRef(value);
  const selectionRef = useRef(null);

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !editorRef.current?.contains(selection.anchorNode)) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  /*
   * =========================================================
   * INITIAL CONTENT
   * =========================================================
   */

  useEffect(() => {
    if (!editorRef.current) return;

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }

    lastHtmlRef.current = value || "";
  }, []);

  /*
   * =========================================================
   * SYNC EXISTING ARTICLE
   * =========================================================
   */

  useEffect(() => {
    if (!editorRef.current) return;

    if (
      value !== lastHtmlRef.current &&
      value !== editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = value || "";
      lastHtmlRef.current = value || "";
    }
  }, [value]);

  /*
   * =========================================================
   * EMIT CONTENT CHANGE
   * =========================================================
   */

  const emitChange = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;

    lastHtmlRef.current = html;

    onChange?.(html);
  };

  /*
   * =========================================================
   * FOCUS
   * =========================================================
   */

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  /*
   * =========================================================
   * ACTIVE FORMATTING
   *
   * Used by EditorToolbar to keep formatting buttons
   * highlighted while the selected text has that format.
   * =========================================================
   */

  const getActiveFormats = () => {
    if (!editorRef.current) {
      return {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      };
    }

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      };
    }

    const node = selection.anchorNode;

    if (!node) {
      return {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      };
    }

    /*
     * Only inspect formatting when the cursor/selection
     * belongs to our editor.
     */

    if (!editorRef.current.contains(node)) {
      return {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      };
    }

    try {
      return {
        bold:
          document.queryCommandState("bold"),

        italic:
          document.queryCommandState("italic"),

        underline:
          document.queryCommandState("underline"),

        strike:
          document.queryCommandState(
            "strikeThrough"
          ),
      };
    } catch {
      return {
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      };
    }
  };

  /*
   * =========================================================
   * EXEC COMMAND
   * =========================================================
   */

  const exec = (
    command,
    commandValue = null
  ) => {
    focusEditor();

    document.execCommand(
      command,
      false,
      commandValue
    );

    emitChange();
  };

  /*
   * =========================================================
   * BLOCK FORMATTING
   * =========================================================
   */

  const formatBlock = (tag) => {
    focusEditor();

    document.execCommand(
      "formatBlock",
      false,
      tag
    );

    emitChange();
  };

  /*
   * =========================================================
   * LINK
   * =========================================================
   */

  const insertLink = (url) => {
    if (!url) return;

    restoreSelection();
    focusEditor();

    document.execCommand(
      "createLink",
      false,
      url
    );

    emitChange();
  };

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const insertImage = (
    url,
    alt = "Article image"
  ) => {
    if (!url) return;

    focusEditor();

    const safeAlt = String(alt)
      .replace(/"/g, "&quot;");

    const safeUrl = String(url)
      .replace(/"/g, "&quot;");

    const imageHtml = `
      <figure class="article-image">
        <img
          src="${safeUrl}"
          alt="${safeAlt}"
        />
      </figure>
      <p><br /></p>
    `;

    document.execCommand(
      "insertHTML",
      false,
      imageHtml
    );

    emitChange();
  };

  /*
   * =========================================================
   * CODE BLOCK
   * =========================================================
   */

  const insertCode = () => {
    focusEditor();

    const codeHtml = `
      <pre class="article-code"><code>Write your code here...</code></pre>
      <p><br /></p>
    `;

    document.execCommand(
      "insertHTML",
      false,
      codeHtml
    );

    emitChange();
  };

  /*
   * =========================================================
   * QUOTE
   * =========================================================
   */

  const insertQuote = () => {
    focusEditor();

    document.execCommand(
      "insertHTML",
      false,
      `
        <blockquote class="article-quote">
          Write your quote here...
        </blockquote>
        <p><br /></p>
      `
    );

    emitChange();
  };

  /*
   * =========================================================
   * DIVIDER
   * =========================================================
   */

  const insertDivider = () => {
    focusEditor();

    document.execCommand(
      "insertHTML",
      false,
      `
        <hr class="article-divider" />
        <p><br /></p>
      `
    );

    emitChange();
  };

  /*
   * =========================================================
   * IMPERATIVE API
   * =========================================================
   */

  useImperativeHandle(
    ref,
    () => ({
      focus: focusEditor,

      getActiveFormats,

      bold: () => {
        exec("bold");
      },

      italic: () => {
        exec("italic");
      },

      underline: () => {
        exec("underline");
      },

      strike: () => {
        exec("strikeThrough");
      },

      heading: (level) => {
        const safeLevel = Math.min(
          Math.max(Number(level) || 1, 1),
          3
        );

        formatBlock(`h${safeLevel}`);
      },

      paragraph: () => {
        formatBlock("p");
      },

      bulletList: () => {
        exec("insertUnorderedList");
      },

      numberedList: () => {
        exec("insertOrderedList");
      },

      quote: insertQuote,

      code: insertCode,

      divider: insertDivider,

      link: insertLink,

      image: insertImage,

      undo: () => {
        exec("undo");
      },

      redo: () => {
        exec("redo");
      },
    }),
    []
  );

  /*
   * =========================================================
   * KEYBOARD SHORTCUTS
   * =========================================================
   */

  const handleKeyDown = (event) => {
    const modifier =
      event.ctrlKey || event.metaKey;

    if (!modifier) return;

    const key = event.key.toLowerCase();

    if (key === "b") {
      event.preventDefault();
      exec("bold");
      return;
    }

    if (key === "i") {
      event.preventDefault();
      exec("italic");
      return;
    }

    if (key === "u") {
      event.preventDefault();
      exec("underline");
      return;
    }

    if (key === "k") {
      event.preventDefault();

      const url = window.prompt(
        "Enter the URL:"
      );

      if (url?.trim()) {
        insertLink(url.trim());
      }
    }
  };

  /*
   * =========================================================
   * SELECTION CHANGE
   *
   * This doesn't change content. It simply makes sure the
   * toolbar can immediately detect formatting after the
   * cursor moves.
   * =========================================================
   */

  const handleSelectionChange = () => rememberSelection();

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      className={[
        "rich-editor",
        `rich-editor-${theme}`,
        `rich-editor-font-${font}`,
      ].join(" ")}
    >
      <div
        ref={editorRef}
        className="rich-editor-surface"
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onKeyDown={handleKeyDown}
         onMouseUp={handleSelectionChange}
         onKeyUp={handleSelectionChange}
         onSelect={handleSelectionChange}
        data-placeholder="Start writing your story..."
        role="textbox"
        aria-multiline="true"
        spellCheck="true"
      />
    </div>
  );
});

export default RichTextEditor;
