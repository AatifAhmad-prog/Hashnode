import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PostList from "../components/post/PostList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import {
  curatedPosts,
  filterCuratedPosts,
} from "../data/curatedPosts";

const trendingTopics = [
  "React",
  "JavaScript",
  "AI",
  "MongoDB",
  "System Design",
];

const mergeUniquePosts = (primaryPosts = [], extraPosts = []) => {
  const seen = new Set();

  return [...primaryPosts, ...extraPosts].filter((post) => {
    const key = post.slug || post._id || post.id;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export default function Feed() {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";

  const [input, setInput] = useState(search);

  const resultsRef = useRef(null);

  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      setError("");

      try {
        const { data } = await api.get("/posts", {
          params: search
            ? {
                search,
              }
            : {},
        });

        const publishedPosts = Array.isArray(data?.posts)
          ? data.posts
          : Array.isArray(data)
            ? data
            : [];

        const builtInPosts = search
          ? filterCuratedPosts(search)
          : curatedPosts;

        setPosts(
          mergeUniquePosts(
            publishedPosts,
            builtInPosts
          )
        );

        setStatus("ready");
      } catch {
        setPosts(
          search
            ? filterCuratedPosts(search)
            : curatedPosts
        );

        setStatus("demo");
        setError("");
      }
    };

    load();
  }, [search]);

  useEffect(() => {
    if (
      !search ||
      status === "loading" ||
      !resultsRef.current
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      const elementTop =
        resultsRef.current.getBoundingClientRect().top +
        window.scrollY;

      const prefersReducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      window.scrollTo({
        top: Math.max(0, elementTop - 88),
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth",
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [search, status, location.key]);

  const featured = useMemo(
    () => posts.slice(0, 3),
    [posts]
  );

  const latest = useMemo(
    () => posts.slice(3),
    [posts]
  );

  const runSearch = (value) => {
    const next = value.trim();

    if (next) {
      setSearchParams({
        search: next,
      });

      return;
    }

    setSearchParams({});
  };

  const submitSearch = (event) => {
    event.preventDefault();

    runSearch(input);
  };

  const selectTrendingTopic = (topic) => {
    setInput(topic);

    runSearch(topic);
  };

  return (
    <div>
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />

        <div className="hero-glow hero-glow-two" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="pulse-dot" />
            THE DEVELOPER COMMUNITY
          </div>

          <h1>
            Build. Write.
            <br />

            <em>Share what you know.</em>
          </h1>

          <p>
            Discover practical engineering stories,
            deep technical guides, and ideas from
            developers building the future.
          </p>

          <form
            className="hero-search"
            onSubmit={submitSearch}
          >
            <span>⌕</span>

            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Search articles by title…"
            />

            <button className="button button-primary">
              Search
            </button>
          </form>

          <div className="hero-tags">
            <span>Trending:</span>

            {trendingTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() =>
                  selectTrendingTopic(topic)
                }
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-code-card">
          <div className="window-bar">
            <i />
            <i />
            <i />

            <span>developer.js</span>
          </div>

          <pre>
            <code>
              <span className="code-purple">
                const
              </span>{" "}

              <span className="code-blue">
                knowledge
              </span>{" "}

              = {"{"}

              {"\n  "}build:{" "}
              <span className="code-green">
                true
              </span>,

              {"\n  "}share:{" "}
              <span className="code-green">
                true
              </span>,

              {"\n  "}learn:{" "}
              <span className="code-green">
                true
              </span>

              {"\n"}
              {"}"};

              {"\n\n"}

              <span className="code-purple">
                await
              </span>{" "}

              community.

              <span className="code-blue">
                connect
              </span>

              (knowledge);
            </code>
          </pre>
        </div>
      </section>

      <section
        className="content-section"
        ref={resultsRef}
      >
        {search ? (
          <>
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  SEARCH RESULTS
                </span>

                <h2>
                  Results for “{search}”
                </h2>
              </div>

              {status !== "loading" && (
                <span className="section-note">
                  {posts.length}{" "}
                  {posts.length === 1
                    ? "article"
                    : "articles"}{" "}
                  found
                </span>
              )}
            </div>

            {status === "loading" ? (
              <LoadingSpinner label="Searching stories…" />
            ) : status === "ready" ||
              status === "demo" ? (
              <PostList posts={posts} />
            ) : (
              <ErrorMessage message={error} />
            )}
          </>
        ) : (
          <>
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  CURATED FOR YOU
                </span>

                <h2>Featured stories</h2>
              </div>

              <span className="section-note">
                Fresh perspectives from the community
              </span>
            </div>

            {status === "loading" ? (
              <LoadingSpinner label="Loading stories…" />
            ) : status === "ready" ||
              status === "demo" ? (
              <PostList
                posts={featured}
                featured
              />
            ) : (
              <ErrorMessage message={error} />
            )}

            <div className="section-heading latest-heading">
              <div>
                <span className="section-kicker">
                  LATEST FROM DEVELOPERS
                </span>

                <h2>Recent articles</h2>
              </div>
            </div>

            {status === "loading"
              ? null
              : (
                <PostList posts={latest} />
              )}
          </>
        )}
      </section>
    </div>
  );
}