export const curatedPosts = [
  {
    id: "curated-react-1",
    slug: "react-state-management-with-context-and-reducers",
    title: "React State Management: Context, Reducers, and Better Boundaries",
    excerpt:
      "A practical way to decide what should stay local, what belongs in Context, and when a reducer makes complex React state easier to reason about.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1400&q=80",
    createdAt: "2026-09-28",
    author: {
      id: "hashnode-editorial",
      name: "Hashnode Editorial",
      bio: "Practical engineering guides for developers building modern applications.",
    },
    tags: [
      { name: "React", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Frontend", slug: "frontend" },
    ],
    readingTime: "6 min",
    font: "editorial",
    theme: "paper",
    content: `
      <h1>React State Management: Context, Reducers, and Better Boundaries</h1>

      <p>
        State management becomes difficult when every value is treated as global state.
        React applications are usually easier to maintain when state is kept as close as
        possible to the component that owns the behavior.
      </p>

      <h2>Start with local state</h2>

      <p>
        A search input, an open modal, a selected tab, or a form field usually belongs to
        the component using it. Keeping these values local reduces unnecessary re-renders
        and makes the component easier to move or reuse later.
      </p>

      <pre class="article-code"><code>function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    &lt;input
      value={query}
      onChange={(event) =&gt; setQuery(event.target.value)}
    /&gt;
  );
}</code></pre>

      <h2>Use Context for shared application state</h2>

      <p>
        Context works well for data such as the authenticated user, theme settings, or a
        small set of preferences that many parts of the component tree need. It removes
        prop drilling without forcing every piece of state into one central store.
      </p>

      <p>
        A useful rule is to keep the Context value focused. An authentication context
        should manage authentication concerns rather than becoming a container for every
        unrelated value in the application.
      </p>

      <h2>Add a reducer when transitions become complex</h2>

      <p>
        When several state values change together, a reducer can make those transitions
        explicit. Instead of scattering multiple setter calls across the application, the
        UI dispatches an action and the reducer decides how state should change.
      </p>

      <pre class="article-code"><code>function editorReducer(state, action) {
  switch (action.type) {
    case "publish":
      return { ...state, status: "published", saving: false };
    case "saving":
      return { ...state, saving: true };
    default:
      return state;
  }
}</code></pre>

      <h2>The main idea</h2>

      <p>
        Good React state management is mostly about boundaries. Keep temporary UI state
        local, share only the data that genuinely needs to be shared, and introduce a
        reducer when state transitions need structure. That approach keeps the application
        understandable without adding more architecture than the project needs.
      </p>
    `,
  },

  {
    id: "curated-javascript-1",
    slug: "modern-javascript-patterns-for-cleaner-apps",
    title: "Modern JavaScript Patterns That Keep Applications Clean",
    excerpt:
      "Five everyday JavaScript patterns for clearer async code, safer data handling, smaller functions, and more predictable application logic.",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
    createdAt: "2026-09-25",
    author: {
      id: "hashnode-editorial",
      name: "Hashnode Editorial",
      bio: "Practical engineering guides for developers building modern applications.",
    },
    tags: [
      { name: "JavaScript", slug: "javascript" },
      { name: "Web Development", slug: "web-development" },
    ],
    readingTime: "7 min",
    font: "editorial",
    theme: "paper",
    content: `
      <h1>Modern JavaScript Patterns That Keep Applications Clean</h1>

      <p>
        Clean JavaScript is less about clever syntax and more about making the next step
        obvious. A few consistent patterns can reduce nested conditions, make asynchronous
        work easier to follow, and prevent small data problems from spreading through the UI.
      </p>

      <h2>Return early</h2>

      <p>
        Guard clauses keep the main path of a function visible. Handle invalid or special
        cases first, then continue with the normal behavior.
      </p>

      <pre class="article-code"><code>function publishPost(post) {
  if (!post) return;
  if (!post.title?.trim()) return;
  if (post.status === "published") return;

  return savePost({ ...post, status: "published" });
}</code></pre>

      <h2>Prefer immutable transformations</h2>

      <p>
        Methods such as map, filter, and object spread make it easier to understand where
        new data comes from. This is especially helpful in React because accidental mutation
        can create UI bugs that are difficult to trace.
      </p>

      <pre class="article-code"><code>const visiblePosts = posts
  .filter((post) =&gt; post.status === "published")
  .map((post) =&gt; ({ ...post, selected: false }));</code></pre>

      <h2>Use async and await around meaningful operations</h2>

      <p>
        Keep network calls inside small functions with clear names. A component should be
        able to call something like loadPosts or publishArticle without needing to know every
        implementation detail of the request.
      </p>

      <h2>Normalize data at the boundary</h2>

      <p>
        If an API can return inconsistent shapes, normalize the response once when it enters
        the application. The rest of the code can then work with one predictable format.
      </p>

      <pre class="article-code"><code>const normalizePost = (post) =&gt; ({
  ...post,
  tags: Array.isArray(post.tags) ? post.tags : [],
  excerpt: post.excerpt || "",
});</code></pre>

      <h2>Write for the next reader</h2>

      <p>
        The best JavaScript pattern is often the one that makes intent obvious. Small
        functions, descriptive names, early returns, predictable data, and focused async
        operations make a codebase easier to extend long after the original feature ships.
      </p>
    `,
  },

  {
    id: "curated-ai-1",
    slug: "building-an-ai-feature-that-users-can-trust",
    title: "Building an AI Feature That Users Can Actually Trust",
    excerpt:
      "A practical product and engineering checklist for adding AI to an application without hiding uncertainty or sacrificing the user experience.",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    createdAt: "2026-09-22",
    author: {
      id: "hashnode-editorial",
      name: "Hashnode Editorial",
      bio: "Practical engineering guides for developers building modern applications.",
    },
    tags: [
      { name: "AI", slug: "ai" },
      { name: "Machine Learning", slug: "machine-learning" },
      { name: "Product Engineering", slug: "product-engineering" },
    ],
    readingTime: "8 min",
    font: "editorial",
    theme: "paper",
    content: `
      <h1>Building an AI Feature That Users Can Actually Trust</h1>

      <p>
        Adding an AI button to a product is easy. Building an AI feature that feels reliable
        is much harder. The difference usually comes from how the feature handles context,
        uncertainty, failure states, and user control.
      </p>

      <h2>Start with one narrow job</h2>

      <p>
        A useful first AI feature should have a clear input and a clear expected outcome.
        Examples include summarizing an article, suggesting tags, rewriting a paragraph, or
        extracting structured information. Narrow tasks are easier to evaluate than a vague
        assistant that is expected to do everything.
      </p>

      <h2>Keep the user in control</h2>

      <p>
        Generated output should normally be treated as a suggestion, not an invisible final
        decision. Let the user review, edit, retry, or discard the result before it becomes
        permanent content.
      </p>

      <pre class="article-code"><code>const suggestion = await generateSummary(article);

setDraftSummary(suggestion);
setNeedsReview(true);</code></pre>

      <h2>Design for uncertainty</h2>

      <p>
        AI output can be incomplete or incorrect even when it sounds confident. The interface
        should make that reality manageable. For factual tasks, show the source material or
        references when possible. For creative tasks, make editing frictionless.
      </p>

      <h2>Measure the useful outcome</h2>

      <p>
        Do not judge the feature only by how often the model returns a response. Measure
        whether users accept the suggestion, how much they edit it, whether they retry, and
        whether the feature saves meaningful time.
      </p>

      <h2>Handle failure like a normal product state</h2>

      <p>
        Timeouts, rate limits, and malformed responses should not break the page. Show a clear
        message and let the user continue their work. A trustworthy AI experience is one where
        the rest of the product remains dependable even when generation fails.
      </p>

      <p>
        The strongest AI features are not necessarily the most complicated. They solve a
        specific problem, expose enough context to earn trust, and preserve the user's ability
        to make the final decision.
      </p>
    `,
  },

  {
    id: "curated-mongodb-1",
    slug: "mongodb-indexes-explained-for-real-projects",
    title: "MongoDB Indexes Explained for Real Projects",
    excerpt:
      "Learn what an index actually changes, how compound indexes work, and how to choose indexes from the queries your application really runs.",
    coverImage:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=80",
    createdAt: "2026-09-19",
    author: {
      id: "hashnode-editorial",
      name: "Hashnode Editorial",
      bio: "Practical engineering guides for developers building modern applications.",
    },
    tags: [
      { name: "MongoDB", slug: "mongodb" },
      { name: "Database", slug: "database" },
      { name: "Backend", slug: "backend" },
    ],
    readingTime: "7 min",
    font: "editorial",
    theme: "paper",
    content: `
      <h1>MongoDB Indexes Explained for Real Projects</h1>

      <p>
        An index is a data structure MongoDB maintains so it can find documents without
        scanning an entire collection. The trade-off is simple: faster reads usually cost
        additional storage and a little more work whenever documents are written or updated.
      </p>

      <h2>Design indexes from queries</h2>

      <p>
        Do not begin by indexing every field. Start with the queries your application runs
        frequently. If the feed always filters by status and sorts by creation time, those
        fields are strong candidates for a compound index.
      </p>

      <pre class="article-code"><code>db.posts.createIndex({
  status: 1,
  createdAt: -1
});</code></pre>

      <h2>Compound index order matters</h2>

      <p>
        A compound index is ordered by the fields you define. An index on status and createdAt
        is useful for queries that begin with status, but it is not automatically the best
        index for every query involving createdAt.
      </p>

      <h2>Use explain to verify</h2>

      <p>
        Instead of guessing whether an index helps, inspect the query plan. MongoDB's explain
        output can show whether the database used an index, how many documents it examined,
        and whether the query still performed expensive work.
      </p>

      <pre class="article-code"><code>db.posts
  .find({ status: "published" })
  .sort({ createdAt: -1 })
  .explain("executionStats");</code></pre>

      <h2>Avoid indexing everything</h2>

      <p>
        Every index must be maintained. A collection with many unnecessary indexes can make
        inserts and updates more expensive and consume significant disk space. Keep indexes
        tied to real access patterns and remove ones that are no longer useful.
      </p>

      <p>
        Good MongoDB performance comes from understanding the workload: the filters, sorts,
        and lookups your application performs most often. Build indexes for those operations,
        measure the result, and adjust as the application grows.
      </p>
    `,
  },

  {
    id: "curated-system-design-1",
    slug: "system-design-scalable-notification-service",
    title: "System Design: Building a Scalable Notification Service",
    excerpt:
      "Walk through the building blocks of a notification system that can handle email, push, and in-app messages without slowing down the main application.",
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    createdAt: "2026-09-16",
    author: {
      id: "hashnode-editorial",
      name: "Hashnode Editorial",
      bio: "Practical engineering guides for developers building modern applications.",
    },
    tags: [
      { name: "System Design", slug: "system-design" },
      { name: "Architecture", slug: "architecture" },
      { name: "Backend", slug: "backend" },
    ],
    readingTime: "9 min",
    font: "editorial",
    theme: "paper",
    content: `
      <h1>System Design: Building a Scalable Notification Service</h1>

      <p>
        Notifications look simple from the outside: an event happens and a message is sent.
        At scale, the system needs to handle spikes, multiple delivery channels, retries,
        preferences, and providers that can fail independently.
      </p>

      <h2>Keep notification work off the request path</h2>

      <p>
        A user should not wait for an email provider or push service before an API request can
        finish. The application can record the event and publish a notification job to a queue.
        Workers process those jobs asynchronously.
      </p>

      <pre class="article-code"><code>await notificationQueue.publish({
  userId,
  type: "article_published",
  articleId
});</code></pre>

      <h2>Separate orchestration from delivery</h2>

      <p>
        The notification service can decide who should receive a message and which channels
        are allowed. Dedicated adapters then handle provider-specific behavior for email,
        push notifications, SMS, or in-app delivery.
      </p>

      <h2>Store user preferences</h2>

      <p>
        Not every event should reach every channel. A preference store allows users to turn
        categories on or off and gives the service one place to decide whether a delivery
        should be created.
      </p>

      <h2>Design retries carefully</h2>

      <p>
        Temporary provider failures should be retried with backoff, but permanent failures
        should not loop forever. After a reasonable number of attempts, move failed jobs to a
        dead-letter queue so they can be inspected without blocking healthy traffic.
      </p>

      <h2>Make delivery idempotent</h2>

      <p>
        Queues can occasionally deliver a job more than once. Give each notification a stable
        identifier and record successful delivery so a retried job does not send the same
        message repeatedly.
      </p>

      <p>
        The overall design is intentionally modular: application events enter a queue,
        notification workers apply preferences and templates, channel adapters talk to
        providers, and delivery records make retries safe. That separation lets each part
        scale without making the core application slower or more fragile.
      </p>
    `,
  },
];

const searchableText = (post) => {
  const tags = (post.tags || [])
    .map((tag) =>
      typeof tag === "string"
        ? tag
        : `${tag.name || ""} ${tag.slug || ""}`
    )
    .join(" ");

  const content = String(post.content || "").replace(/<[^>]*>/g, " ");

  return `${post.title || ""} ${post.excerpt || ""} ${tags} ${content}`.toLowerCase();
};

export const filterCuratedPosts = (search = "") => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return curatedPosts;
  }

  const queryTerms = query.split(/\s+/).filter(Boolean);

  return curatedPosts.filter((post) => {
    const text = searchableText(post);
    const words = text.split(/[^a-z0-9+#.-]+/).filter(Boolean);

    return queryTerms.every((term) =>
      term.length <= 2
        ? words.includes(term)
        : text.includes(term)
    );
  });
};

export const getCuratedPostBySlug = (slug = "") =>
  curatedPosts.find((post) => post.slug === slug) || null;