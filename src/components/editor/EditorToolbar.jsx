import { useEffect, useState } from "react";

export default function EditorToolbar({
  editorRef,
  onImage,
  onFontChange,
  onThemeChange,
  currentFont = "editorial",
  currentTheme = "paper",
}) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });

  /*
   * ---------------------------------------------------------
   * CHECK ACTIVE FORMATTING
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const checkFormatting = () => {
      if (!editorRef?.current) return;

      try {
        const formats =
          editorRef.current.getActiveFormats?.();

        if (formats) {
          setActiveFormats(formats);
        }
      } catch {
        // Editor may not be mounted yet.
      }
    };

    document.addEventListener(
      "selectionchange",
      checkFormatting
    );

    window.addEventListener(
      "mouseup",
      checkFormatting
    );

    window.addEventListener(
      "keyup",
      checkFormatting
    );

    return () => {
      document.removeEventListener(
        "selectionchange",
        checkFormatting
      );

      window.removeEventListener(
        "mouseup",
        checkFormatting
      );

      window.removeEventListener(
        "keyup",
        checkFormatting
      );
    };
  }, [editorRef]);

  /*
   * ---------------------------------------------------------
   * RUN EDITOR COMMAND
   * ---------------------------------------------------------
   */

  const run = (action, ...args) => {
    editorRef?.current?.[action]?.(...args);

    requestAnimationFrame(() => {
      try {
        const formats =
          editorRef.current?.getActiveFormats?.();

        if (formats) {
          setActiveFormats(formats);
        }
      } catch {
        // Ignore if editor is unavailable.
      }
    });
  };

  /*
   * ---------------------------------------------------------
   * LINK
   * ---------------------------------------------------------
   */

  const handleLink = () => {
    const url = linkUrl.trim();

    if (!url) return;

    run("link", url);

    setLinkUrl("");
    setShowLinkInput(false);
  };

  /*
   * ---------------------------------------------------------
   * ACTIVE CLASS
   * ---------------------------------------------------------
   */

  const activeClass = (isActive) =>
    isActive
      ? "toolbar-button toolbar-button-active"
      : "toolbar-button";

  return (
    <div className="editor-toolbar-wrapper">

      {/* ================================================= */}
      {/* MAIN TOOLBAR */}
      {/* ================================================= */}

      <div className="editor-toolbar">

        {/* ------------------------------------------------- */}
        {/* TYPOGRAPHY */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group toolbar-typography">

          <label className="toolbar-select-wrapper">
            <span className="toolbar-select-label">
              Font
            </span>

            <select
              className="toolbar-select"
              value={currentFont}
              onChange={(event) =>
                onFontChange?.(
                  event.target.value
                )
              }
              aria-label="Article font"
            >
              <option value="editorial">
                Editorial Serif
              </option>

              <option value="modern">
                Modern Sans
              </option>

              <option value="newspaper">
                Classic Newspaper
              </option>

              <option value="georgia">
                Georgia
              </option>

              <option value="garamond">
                Garamond
              </option>

              <option value="times">
                Times New Roman
              </option>

              <option value="palatino">
                Palatino
              </option>

              <option value="system">
                System Sans
              </option>

              <option value="verdana">
                Verdana
              </option>

              <option value="trebuchet">
                Trebuchet
              </option>

              <option value="mono">
                Monospace
              </option>

              <option value="courier">
                Courier New
              </option>
            </select>
          </label>

          <label className="toolbar-select-wrapper">
            <span className="toolbar-select-label">
              Theme
            </span>

            <select
              className="toolbar-select"
              value={currentTheme}
              onChange={(event) =>
                onThemeChange?.(
                  event.target.value
                )
              }
              aria-label="Article theme"
            >
              <option value="paper">
                Paper
              </option>

              <option value="vintage">
                Vintage
              </option>

              <option value="clean">
                Clean
              </option>

              <option value="night">
                Night
              </option>

              <option value="rose">
                Rose
              </option>
            </select>
          </label>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* TEXT FORMATTING */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group">

          <button
            type="button"
            className={activeClass(
              activeFormats.bold
            )}
            onClick={() => run("bold")}
            title="Bold"
            aria-label="Bold"
            aria-pressed={
              activeFormats.bold
            }
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={activeClass(
              activeFormats.italic
            )}
            onClick={() => run("italic")}
            title="Italic"
            aria-label="Italic"
            aria-pressed={
              activeFormats.italic
            }
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={activeClass(
              activeFormats.underline
            )}
            onClick={() =>
              run("underline")
            }
            title="Underline"
            aria-label="Underline"
            aria-pressed={
              activeFormats.underline
            }
          >
            <u>U</u>
          </button>

          <button
            type="button"
            className={activeClass(
              activeFormats.strike
            )}
            onClick={() =>
              run("strike")
            }
            title="Strikethrough"
            aria-label="Strikethrough"
            aria-pressed={
              activeFormats.strike
            }
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* HEADINGS */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group">

          <button
            type="button"
            className="toolbar-button toolbar-heading"
            onClick={() =>
              run("heading", 1)
            }
            title="Heading 1"
          >
            H1
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-heading"
            onClick={() =>
              run("heading", 2)
            }
            title="Heading 2"
          >
            H2
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-heading"
            onClick={() =>
              run("heading", 3)
            }
            title="Heading 3"
          >
            H3
          </button>

          <button
            type="button"
            className="toolbar-button"
            onClick={() =>
              run("paragraph")
            }
            title="Normal paragraph"
          >
            P
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* LISTS */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group">

          <button
            type="button"
            className="toolbar-button toolbar-list"
            onClick={() =>
              run("bulletList")
            }
            title="Bullet list"
            aria-label="Bullet list"
          >
            <span>•</span>
            <span>List</span>
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-list"
            onClick={() =>
              run("numberedList")
            }
            title="Numbered list"
            aria-label="Numbered list"
          >
            <span>1.</span>
            <span>List</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* BLOCKS */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group">

          <button
            type="button"
            className="toolbar-button toolbar-icon-button"
            onClick={() =>
              run("quote")
            }
            title="Quote"
            aria-label="Insert quote"
          >
            ❝
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-code-button"
            onClick={() =>
              run("code")
            }
            title="Code block"
            aria-label="Insert code block"
          >
            &lt;/&gt;
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-icon-button"
            onClick={() =>
              run("divider")
            }
            title="Divider"
            aria-label="Insert divider"
          >
            ―
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* MEDIA */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group">

          <button
            type="button"
            className="toolbar-button toolbar-media-button"
            onClick={onImage}
            title="Insert image"
          >
            <span className="toolbar-button-icon">
              ▧
            </span>

            <span>Image</span>
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-media-button"
            onClick={() =>
              setShowLinkInput(
                (current) => !current
              )
            }
            title="Insert link"
          >
            <span className="toolbar-button-icon">
              ↗
            </span>

            <span>Link</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* ------------------------------------------------- */}
        {/* HISTORY */}
        {/* ------------------------------------------------- */}

        <div className="toolbar-group toolbar-history">

          <button
            type="button"
            className="toolbar-button toolbar-icon-button"
            onClick={() =>
              run("undo")
            }
            title="Undo"
            aria-label="Undo"
          >
            ↶
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-icon-button"
            onClick={() =>
              run("redo")
            }
            title="Redo"
            aria-label="Redo"
          >
            ↷
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* LINK PANEL */}
      {/* ================================================= */}

      {showLinkInput && (
        <div className="toolbar-link-panel">

          <div className="toolbar-link-input-wrapper">

            <span className="toolbar-link-icon">
              ↗
            </span>

            <input
              type="url"
              value={linkUrl}
              onChange={(event) =>
                setLinkUrl(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleLink();
                }

                if (event.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
              }}
              placeholder="https://example.com"
              autoFocus
            />
          </div>

          <button
            type="button"
            className="toolbar-link-apply"
            onClick={handleLink}
            disabled={!linkUrl.trim()}
          >
            Add link
          </button>

          <button
            type="button"
            className="toolbar-link-cancel"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl("");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}