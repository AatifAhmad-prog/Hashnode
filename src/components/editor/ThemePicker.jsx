import React from "react";

const themes = [
  {
    id: "paper",
    name: "Paper",
    description: "Warm editorial",
    className: "theme-paper",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Old newspaper",
    className: "theme-vintage",
  },
  {
    id: "clean",
    name: "Clean",
    description: "Minimal & bright",
    className: "theme-clean",
  },
  {
    id: "night",
    name: "Night",
    description: "Dark reading",
    className: "theme-night",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft & refined",
    className: "theme-rose",
  },
];

export default function ThemePicker({
  value = "paper",
  onChange,
}) {
  const selectedTheme =
    themes.find((theme) => theme.id === value) ||
    themes[0];

  return (
    <div className="theme-picker">

      {/* ================================================ */}
      {/* HEADER */}
      {/* ================================================ */}

      <div className="picker-heading">
        <div>
          <span className="picker-label">
            ARTICLE THEME
          </span>

          <span className="picker-current">
            {selectedTheme.name}
          </span>
        </div>
      </div>

      {/* ================================================ */}
      {/* THEME OPTIONS */}
      {/* ================================================ */}

      <div className="theme-options">
        {themes.map((theme) => {
          const active = value === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              className={[
                "theme-option",
                active
                  ? "theme-option-active"
                  : "",
              ].join(" ")}
              onClick={() =>
                onChange?.(theme.id)
              }
              aria-pressed={active}
              title={`Use ${theme.name} theme`}
            >

              {/* Theme preview */}

              <span
                className={`theme-preview ${theme.className}`}
                aria-hidden="true"
              >
                <span className="theme-preview-heading">
                  Aa
                </span>

                <span className="theme-preview-line theme-preview-line-long" />

                <span className="theme-preview-line" />

                <span className="theme-preview-line theme-preview-line-short" />

                <span className="theme-preview-dot" />
              </span>

              {/* Theme information */}

              <span className="theme-option-info">
                <strong>
                  {theme.name}
                </strong>

                <small>
                  {theme.description}
                </small>
              </span>

              {/* Selected indicator */}

              {active && (
                <span
                  className="theme-option-check"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}