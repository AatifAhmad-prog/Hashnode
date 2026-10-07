import React from "react";

const fonts = [
  {
    id: "editorial",
    name: "Editorial Serif",
    description: "Classic magazine",
    preview: "Aa",
  },
  {
    id: "modern",
    name: "Modern Sans",
    description: "Clean & modern",
    preview: "Aa",
  },
  {
    id: "newspaper",
    name: "Classic Newspaper",
    description: "Traditional editorial",
    preview: "Aa",
  },
  {
    id: "georgia",
    name: "Georgia",
    description: "Elegant serif",
    preview: "Aa",
  },
  {
    id: "garamond",
    name: "Garamond",
    description: "Refined literary",
    preview: "Aa",
  },
  {
    id: "times",
    name: "Times New Roman",
    description: "Traditional serif",
    preview: "Aa",
  },
  {
    id: "palatino",
    name: "Palatino",
    description: "Classic readable",
    preview: "Aa",
  },
  {
    id: "system",
    name: "System Sans",
    description: "Simple & familiar",
    preview: "Aa",
  },
  {
    id: "verdana",
    name: "Verdana",
    description: "Highly readable",
    preview: "Aa",
  },
  {
    id: "trebuchet",
    name: "Trebuchet",
    description: "Friendly sans",
    preview: "Aa",
  },
  {
    id: "mono",
    name: "Monospace",
    description: "Technical writing",
    preview: "Aa",
  },
  {
    id: "courier",
    name: "Courier New",
    description: "Developer style",
    preview: "Aa",
  },
];

export default function FontPicker({
  value = "editorial",
  onChange,
}) {
  const selectedFont =
    fonts.find((font) => font.id === value) ||
    fonts[0];

  return (
    <div className="font-picker">

      {/* ================================================ */}
      {/* HEADER */}
      {/* ================================================ */}

      <div className="picker-heading">
        <div>
          <span className="picker-label">
            TYPEFACE
          </span>

          <span className="picker-current">
            {selectedFont.name}
          </span>
        </div>
      </div>

      {/* ================================================ */}
      {/* FONT OPTIONS */}
      {/* ================================================ */}

      <div className="font-options">
        {fonts.map((font) => {
          const active = value === font.id;

          return (
            <button
              key={font.id}
              type="button"
              className={[
                "font-option",
                `font-option-${font.id}`,
                active
                  ? "font-option-active"
                  : "",
              ].join(" ")}
              onClick={() =>
                onChange?.(font.id)
              }
              aria-pressed={active}
              title={`Use ${font.name}`}
            >

              {/* Font preview */}

              <span className="font-option-preview">
                {font.preview}
              </span>

              {/* Font information */}

              <span className="font-option-info">
                <strong>
                  {font.name}
                </strong>

                <small>
                  {font.description}
                </small>
              </span>

              {/* Selected indicator */}

              {active && (
                <span
                  className="font-option-check"
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