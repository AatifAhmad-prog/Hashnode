import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import TagPill from "../components/post/TagPill";

import LoadingSpinner from "../components/ui/LoadingSpinner";

import ErrorMessage from "../components/ui/ErrorMessage";

import {
  getCuratedPostBySlug,
} from "../data/curatedPosts";

export default function PostDetail() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);

  const [status, setStatus] =
    useState("loading");

  useEffect(() => {
    const builtInPost =
      getCuratedPostBySlug(slug);

    if (builtInPost) {
      setPost(builtInPost);

      setStatus("demo");

      return;
    }

    const load = async () => {
      setStatus("loading");

      try {
        const { data } = await api.get(
          `/posts/${slug}`
        );

        setPost(data.post || data);

        setStatus("ready");
      } catch (error) {
        console.error(
          "Failed to load post:",
          error
        );

        setPost(null);

        setStatus("error");
      }
    };

    load();
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="center-page">
        <LoadingSpinner label="Opening article…" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="center-page">
        <ErrorMessage message="This article could not be found." />
      </div>
    );
  }

  const articleFont =
    post.font || "editorial";

  const articleTheme =
    post.theme || "paper";

  return (
    <article className="article-page">
      <div className="article-header">
        <Link
          to="/"
          className="back-link"
        >
          ← Back to explore
        </Link>

        <div className="article-tags">
          {(post.tags || []).map((tag) => {
            const tagKey =
              typeof tag === "string"
                ? tag
                : tag.slug || tag.name;

            return (
              <TagPill
                key={tagKey}
                tag={tag}
              />
            );
          })}
        </div>

        <h1>{post.title}</h1>

        <p className="article-lead">
          {post.excerpt ||
            "A technical story from the developer community."}
        </p>

        <div className="article-author">
          <span className="avatar avatar-medium">
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt=""
              />
            ) : (
              (
                post.author?.name || "A"
              )
                .charAt(0)
                .toUpperCase()
            )}
          </span>

          <div>
            <Link
              to={`/profile/${
                post.author?._id ||
                post.author?.id ||
                "author"
              }`}
            >
              {post.author?.name ||
                "Anonymous Developer"}
            </Link>

            <span>
              Published{" "}

              {new Date(
                post.createdAt ||
                  Date.now()
              ).toLocaleDateString(
                "en",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}{" "}

              ·{" "}

              {post.readingTime ||
                "7 min"}{" "}
              read
            </span>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <img
          className="article-cover"
          src={post.coverImage}
          alt=""
        />
      )}

      <div className="article-layout">
        <aside className="article-aside">
          <span>
            IN THIS ARTICLE
          </span>

          <a href="#content">
            Overview
          </a>

          <a href="#content">
            Implementation
          </a>

          <a href="#content">
            Best practices
          </a>
        </aside>

        <div
          id="content"
          className={`article-content rich-editor-${articleTheme} rich-editor-font-${articleFont}`}
        >
          <div
            className="rich-editor-surface"
            dangerouslySetInnerHTML={{
              __html:
                post.content || "",
            }}
          />
        </div>
      </div>
    </article>
  );
}