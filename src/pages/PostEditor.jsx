import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import EditorToolbar from "../components/editor/EditorToolbar";
import FontPicker from "../components/editor/FontPicker";
import ThemePicker from "../components/editor/ThemePicker";
import ImageUploader from "../components/editor/ImageUploader";
import RichTextEditor from "../components/editor/RichTextEditor";

export default function PostEditor() {
  const editorRef = useRef(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Keep the existing App.jsx route name: /editor/:id
  const { id } = useParams();

  const isEditing = Boolean(id);

  /*
   * =========================================================
   * ARTICLE STATE
   * =========================================================
   */

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [font, setFont] = useState("editorial");
  const [theme, setTheme] = useState("paper");

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [references, setReferences] = useState([]);
  const [referenceTitle, setReferenceTitle] =
    useState("");
  const [referenceUrl, setReferenceUrl] =
    useState("");

  /*
   * =========================================================
   * UI STATE
   * =========================================================
   */

  const [showImageUploader, setShowImageUploader] =
    useState(false);

  const [showSettings, setShowSettings] =
    useState(false);

  const [loading, setLoading] = useState(
    isEditing
  );

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /*
   * =========================================================
   * LOAD EXISTING ARTICLE
   * =========================================================
   *
   * IMPORTANT:
   *
   * Your existing App.jsx uses:
   *
   * /editor/:id
   *
   * Therefore this component uses "id".
   *
   * The backend will receive:
   *
   * GET /api/posts/:id
   *
   * =========================================================
   */

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/posts/${id}`
        );

        const post = data.post || data;

        setTitle(post.title || "");
        setExcerpt(post.excerpt || "");
        setContent(post.content || "");

        setFont(
          post.font || "editorial"
        );

        setTheme(
          post.theme || "paper"
        );

        setTags(
          Array.isArray(post.tags)
            ? post.tags.map((tag) =>
                typeof tag === "string"
                  ? tag
                  : tag.name
              )
            : []
        );

        setReferences(
          Array.isArray(post.references)
            ? post.references
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load post:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load this article."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, isEditing]);

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  const handleContentChange = (html) => {
    setContent(html);
  };

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const handleImageInsert = (
    imageUrl,
    altText
  ) => {
    editorRef.current?.image(
      imageUrl,
      altText
    );

    setShowImageUploader(false);
  };

  /*
   * =========================================================
   * TAGS
   * =========================================================
   */

  const addTag = () => {
    const tag = tagInput
      .trim()
      .toLowerCase()
      .replace(/^#/, "");

    if (!tag) return;

    if (tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setTags((current) => [
      ...current,
      tag,
    ]);

    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags((current) =>
      current.filter(
        (tag) => tag !== tagToRemove
      )
    );
  };

  const handleTagKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
      return;
    }

    if (
      event.key === "Backspace" &&
      !tagInput &&
      tags.length
    ) {
      setTags((current) =>
        current.slice(0, -1)
      );
    }
  };

  /*
   * =========================================================
   * REFERENCES
   * =========================================================
   */

  const addReference = () => {
    const titleValue =
      referenceTitle.trim();

    const urlValue =
      referenceUrl.trim();

    if (!titleValue || !urlValue) {
      return;
    }

    setReferences((current) => [
      ...current,
      {
        title: titleValue,
        url: urlValue,
      },
    ]);

    setReferenceTitle("");
    setReferenceUrl("");
  };

  const removeReference = (index) => {
    setReferences((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const handleReferenceKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addReference();
    }
  };

  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const validate = () => {
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter an article title."
      );
      return false;
    }

    if (!content.trim()) {
      setError(
        "Please write some content before publishing."
      );
      return false;
    }

    return true;
  };

  /*
   * =========================================================
   * BUILD PAYLOAD
   * =========================================================
   */

  const buildPayload = (status) => ({
    title: title.trim(),

    excerpt: excerpt.trim(),

    content,

    font,

    theme,

    tags,

    references,

    status,
  });

  /*
   * =========================================================
   * PUBLISH ARTICLE
   * =========================================================
   */

  const handlePublish = async () => {
    setError("");
    setMessage("");

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload =
        buildPayload("published");

      let response;

      if (isEditing) {
        response = await api.put(
          `/posts/${id}`,
          payload
        );
      } else {
        response = await api.post(
          "/posts",
          payload
        );
      }

      const savedPost =
        response.data?.post ||
        response.data;

      /*
       * The backend should return the article slug.
       *
       * Example:
       *
       * {
       *   post: {
       *     _id: "...",
       *     slug: "my-first-article"
       *   }
       * }
       */

      const savedSlug =
        savedPost?.slug;

      setMessage(
        isEditing
          ? "Article updated successfully."
          : "Article published successfully."
      );

      if (savedSlug) {
        setTimeout(() => {
          navigate(
            `/post/${savedSlug}`
          );
        }, 700);
      } else {
        /*
         * If the backend doesn't return a slug,
         * stay on the editor rather than navigating
         * to an invalid URL.
         */
        console.warn(
          "Post saved but backend did not return a slug."
        );
      }
    } catch (err) {
      console.error(
        "Publishing failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to publish the article."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * SAVE DRAFT
   * =========================================================
   */

  const handleSaveDraft = async () => {
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError(
        "Add a title before saving the draft."
      );
      return;
    }

    try {
      setSaving(true);

      const payload =
        buildPayload("draft");

      let response;

      if (isEditing) {
        response = await api.put(
          `/posts/${id}`,
          payload
        );
      } else {
        response = await api.post(
          "/posts",
          payload
        );
      }

      const savedPost =
        response.data?.post ||
        response.data;

      /*
       * If this was a new draft, update the URL
       * to the newly created post ID so the user
       * can continue editing the same draft.
       */

      if (!isEditing && savedPost?._id) {
        navigate(
          `/editor/${savedPost._id}`,
          { replace: true }
        );
      }

      setMessage(
        "Draft saved successfully."
      );
    } catch (err) {
      console.error(
        "Draft save failed:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save the draft."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="center-page">
        <div className="editor-loading">
          Loading editor…
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <div className="post-editor-page">

      {/* ================================================= */}
      {/* TOP BAR */}
      {/* ================================================= */}

      <header className="post-editor-topbar">

        <div className="post-editor-topbar-left">

          <Link
            to="/"
            className="editor-back-link"
          >
            ← Back
          </Link>

          <div className="editor-topbar-divider" />

          <span className="editor-status">
            {isEditing
              ? "Editing article"
              : "New article"}
          </span>
        </div>

        <div className="post-editor-topbar-actions">

          <button
            type="button"
            className="editor-draft-button"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving
              ? "Saving…"
              : "Save draft"}
          </button>

          <button
            type="button"
            className="editor-publish-button"
            onClick={handlePublish}
            disabled={saving}
          >
            {saving
              ? "Publishing…"
              : isEditing
              ? "Update article"
              : "Publish article"}
          </button>
        </div>
      </header>

      {/* ================================================= */}
      {/* MAIN EDITOR */}
      {/* ================================================= */}

      <main className="post-editor-main">

        {/* ================================================= */}
        {/* ARTICLE HEADING */}
        {/* ================================================= */}

        <section className="post-editor-heading">

          <input
            className="post-title-input"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            placeholder="Write your article title..."
            maxLength={180}
          />

          <textarea
            className="post-excerpt-input"
            value={excerpt}
            onChange={(event) =>
              setExcerpt(
                event.target.value
              )
            }
            placeholder="Add a short description of your article..."
            rows={2}
            maxLength={300}
          />
        </section>

        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}

        <section className="post-editor-toolbar-section">

          <EditorToolbar
            editorRef={editorRef}
            onImage={() =>
              setShowImageUploader(true)
            }
            onFontChange={setFont}
            onThemeChange={setTheme}
            currentFont={font}
            currentTheme={theme}
          />
        </section>

        {/* ================================================= */}
        {/* RICH TEXT EDITOR */}
        {/* ================================================= */}

        <section className="post-editor-writing-area">

          <RichTextEditor
            ref={editorRef}
            value={content}
            onChange={
              handleContentChange
            }
            font={font}
            theme={theme}
          />
        </section>

        {/* ================================================= */}
        {/* ARTICLE SETTINGS */}
        {/* ================================================= */}

        <section className="post-editor-settings">

          <button
            type="button"
            className="editor-settings-toggle"
            onClick={() =>
              setShowSettings(
                (current) => !current
              )
            }
          >
            <span>
              Article settings
            </span>

            <span>
              {showSettings
                ? "−"
                : "+"}
            </span>
          </button>

          {showSettings && (
            <div className="editor-settings-content">

              {/* ========================================= */}
              {/* FONT */}
              {/* ========================================= */}

              <div className="editor-setting-block">

                <FontPicker
                  value={font}
                  onChange={setFont}
                />
              </div>

              {/* ========================================= */}
              {/* THEME */}
              {/* ========================================= */}

              <div className="editor-setting-block">

                <ThemePicker
                  value={theme}
                  onChange={setTheme}
                />
              </div>

              {/* ========================================= */}
              {/* TAGS */}
              {/* ========================================= */}

              <div className="editor-setting-block">

                <div className="editor-setting-heading">

                  <span className="picker-label">
                    TAGS
                  </span>

                  <span className="editor-setting-description">
                    Help readers discover your article
                  </span>
                </div>

                <div className="editor-tags-input">

                  <div className="editor-tag-list">

                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="editor-tag"
                      >
                        #{tag}

                        <button
                          type="button"
                          onClick={() =>
                            removeTag(tag)
                          }
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={tagInput}
                      onChange={(event) =>
                        setTagInput(
                          event.target.value
                        )
                      }
                      onKeyDown={
                        handleTagKeyDown
                      }
                      onBlur={addTag}
                      placeholder={
                        tags.length
                          ? "Add another tag..."
                          : "Add tags..."
                      }
                    />
                  </div>
                </div>

                <small className="editor-input-hint">
                  Press Enter or comma to add a tag.
                </small>
              </div>

              {/* ========================================= */}
              {/* REFERENCES */}
              {/* ========================================= */}

              <div className="editor-setting-block">

                <div className="editor-setting-heading">

                  <span className="picker-label">
                    REFERENCES
                  </span>

                  <span className="editor-setting-description">
                    Add sources, documentation or useful links
                  </span>
                </div>

                <div className="editor-reference-form">

                  <input
                    type="text"
                    value={referenceTitle}
                    onChange={(event) =>
                      setReferenceTitle(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleReferenceKeyDown
                    }
                    placeholder="Reference title"
                  />

                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(event) =>
                      setReferenceUrl(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleReferenceKeyDown
                    }
                    placeholder="https://example.com"
                  />

                  <button
                    type="button"
                    className="reference-add-button"
                    onClick={addReference}
                    disabled={
                      !referenceTitle.trim() ||
                      !referenceUrl.trim()
                    }
                  >
                    Add
                  </button>
                </div>

                {references.length > 0 && (
                  <div className="editor-reference-list">

                    {references.map(
                      (reference, index) => (
                        <div
                          className="editor-reference-item"
                          key={`${reference.url}-${index}`}
                        >
                          <div>
                            <strong>
                              {reference.title}
                            </strong>

                            <a
                              href={
                                reference.url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              {reference.url}
                            </a>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeReference(
                                index
                              )
                            }
                            aria-label="Remove reference"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        {(error || message) && (
          <div
            className={
              error
                ? "editor-message editor-message-error"
                : "editor-message editor-message-success"
            }
          >
            {error || message}
          </div>
        )}

        {/* ================================================= */}
        {/* BOTTOM ACTIONS */}
        {/* ================================================= */}

        <footer className="post-editor-footer">

          <div>
            <span className="editor-footer-label">
              READY TO PUBLISH?
            </span>

            <p>
              Review your article and publish it
              when you're ready.
            </p>
          </div>

          <div className="post-editor-footer-actions">

            <button
              type="button"
              className="editor-draft-button"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              Save draft
            </button>

            <button
              type="button"
              className="editor-publish-button"
              onClick={handlePublish}
              disabled={saving}
            >
              {saving
                ? "Publishing…"
                : isEditing
                ? "Update article"
                : "Publish article"}
            </button>
          </div>
        </footer>
      </main>

      {/* ================================================= */}
      {/* IMAGE UPLOADER */}
      {/* ================================================= */}

      {showImageUploader && (
        <ImageUploader
          onInsert={handleImageInsert}
          onClose={() =>
            setShowImageUploader(false)
          }
        />
      )}
    </div>
  );
}