import { useRef, useState } from "react";

export default function ImageUploader({ onInsert, onClose }) {
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const resetFile = () => {
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError("");

    if (nextMode === "url") {
      resetFile();
    } else {
      setImageUrl("");
    }
  };

  /*
   * ---------------------------------------------------------
   * FILE SELECT
   * ---------------------------------------------------------
   */

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // 10 MB limit for local images.
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(localPreview);

    if (!altText.trim()) {
      setAltText(
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * URL INSERT
   * ---------------------------------------------------------
   */

  const handleUrlInsert = () => {
    const url = imageUrl.trim();

    if (!url) {
      setError("Please enter an image URL.");
      return;
    }

    onInsert?.(
      url,
      altText.trim() || "Article image"
    );

    setImageUrl("");
    setAltText("");
    setError("");
  };

  /*
   * ---------------------------------------------------------
   * FILE INSERT
   * ---------------------------------------------------------
   *
   * Currently this inserts a local browser URL.
   *
   * When your backend/cloud storage is connected,
   * this function can be changed to upload the file
   * and use the permanent returned URL.
   */

  const handleFileInsert = () => {
    if (!selectedFile || !previewUrl) {
      setError("Please choose an image first.");
      return;
    }

    onInsert?.(
      previewUrl,
      altText.trim() || selectedFile.name
    );

    setSelectedFile(null);
    setAltText("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPreviewUrl("");
  };

  /*
   * ---------------------------------------------------------
   * DRAG & DROP
   * ---------------------------------------------------------
   */

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please drop a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreview = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(localPreview);

    if (!altText.trim()) {
      setAltText(
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
      );
    }
  };

  return (
    <div
      className="image-uploader-overlay"
      onMouseDown={onClose}
    >
      <div
        className="image-uploader-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="image-uploader-header">

          <div>
            <span className="section-kicker">
              MEDIA
            </span>

            <h3>Add an image</h3>

            <p>
              Add an image to your article using a
              URL or a file from your device.
            </p>
          </div>

          <button
            type="button"
            className="image-uploader-close"
            onClick={onClose}
            aria-label="Close image uploader"
          >
            ×
          </button>
        </div>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="image-uploader-tabs">

          <button
            type="button"
            className={`image-uploader-tab ${
              mode === "upload"
                ? "image-uploader-tab-active"
                : ""
            }`}
            onClick={() =>
              handleModeChange("upload")
            }
          >
            Upload file
          </button>

          <button
            type="button"
            className={`image-uploader-tab ${
              mode === "url"
                ? "image-uploader-tab-active"
                : ""
            }`}
            onClick={() =>
              handleModeChange("url")
            }
          >
            Image URL
          </button>
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="image-uploader-error">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* UPLOAD MODE */}
        {/* ================================================= */}

        {mode === "upload" && (
          <div className="image-uploader-content">

            {!selectedFile ? (
              <button
                type="button"
                className="image-upload-dropzone"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={handleDrop}
              >
                <span className="image-upload-icon">
                  ↑
                </span>

                <strong>
                  Choose an image
                </strong>

                <span>
                  Click to browse or drag and drop
                </span>

                <small>
                  PNG, JPG, JPEG, GIF or WEBP ·
                  Max 10 MB
                </small>
              </button>
            ) : (
              <div className="image-selected-file">

                {previewUrl && (
                  <div className="image-uploader-preview image-file-preview">
                    <img
                      src={previewUrl}
                      alt={
                        altText ||
                        "Selected image preview"
                      }
                    />
                  </div>
                )}

                <div className="image-selected-info">
                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(
                      selectedFile.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </span>
                </div>

                <button
                  type="button"
                  className="image-remove-button"
                  onClick={resetFile}
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              onChange={handleFileSelect}
              hidden
            />

            <label className="image-uploader-field">
              <span>Alt text</span>

              <input
                type="text"
                value={altText}
                onChange={(event) =>
                  setAltText(event.target.value)
                }
                placeholder="Describe the image for accessibility"
              />
            </label>

            <div className="image-uploader-actions">

              <button
                type="button"
                className="button button-ghost"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={handleFileInsert}
                disabled={!selectedFile}
              >
                Insert image
              </button>
            </div>

            <p className="image-uploader-note">
              Files are currently stored as a local
              browser preview. Permanent image storage
              can be connected to your backend later.
            </p>
          </div>
        )}

        {/* ================================================= */}
        {/* URL MODE */}
        {/* ================================================= */}

        {mode === "url" && (
          <div className="image-uploader-content">

            <label className="image-uploader-field">
              <span>Image URL</span>

              <input
                type="url"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="https://example.com/image.jpg"
                autoFocus
              />
            </label>

            <label className="image-uploader-field">
              <span>Alt text</span>

              <input
                type="text"
                value={altText}
                onChange={(event) =>
                  setAltText(
                    event.target.value
                  )
                }
                placeholder="Describe the image for accessibility"
              />
            </label>

            {imageUrl.trim() && (
              <div className="image-uploader-preview">

                <img
                  src={imageUrl}
                  alt={
                    altText ||
                    "Image preview"
                  }
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    setError(
                      "Unable to load this image URL."
                    );
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display =
                      "block";

                    setError("");
                  }}
                />
              </div>
            )}

            <div className="image-uploader-actions">

              <button
                type="button"
                className="button button-ghost"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={handleUrlInsert}
                disabled={!imageUrl.trim()}
              >
                Insert image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}