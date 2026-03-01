/**
 * ZENITH: The Blogger Core
 * Frontend JavaScript — All pages
 */

// ─── Theme Management ─────────────────────────────────────────────────────────

(function initTheme() {
  const saved = localStorage.getItem("zenith-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  const toggle = document.getElementById("themeToggle");
  const icon = document.getElementById("toggleIcon");
  if (!toggle) return;

  if (saved === "light") {
    toggle.checked = true;
    if (icon) icon.textContent = "☀️";
  } else {
    if (icon) icon.textContent = "🌙";
  }

  toggle.addEventListener("change", () => {
    const next = toggle.checked ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("zenith-theme", next);
    if (icon) icon.textContent = next === "light" ? "☀️" : "🌙";
  });
})();

// ─── Toast Notifications ──────────────────────────────────────────────────────

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || "✦"}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function showConfirm({ title, message, onConfirm }) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="dialog">
      <div class="dialog-icon">🗑</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="dialog-actions">
        <button class="btn btn-ghost" id="dialogCancel">Cancel</button>
        <button class="btn btn-danger" id="dialogConfirm" style="background:var(--grad-btn-danger);color:#fff;border:none;">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector("#dialogCancel").addEventListener("click", () => overlay.remove());
  overlay.querySelector("#dialogConfirm").addEventListener("click", () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

const api = {
  async get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async post(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async patch(url, body) {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async delete(url) {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content) {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function excerpt(text, len = 120) {
  return text.length > len ? text.slice(0, len).trim() + "…" : text;
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// ─── Page: Homepage (index.html) ──────────────────────────────────────────────

if (document.getElementById("blogGrid")) {
  const grid = document.getElementById("blogGrid");
  const skeleton = document.getElementById("skeletonLoader");
  const countEl = document.getElementById("postCount");

  async function loadPosts() {
    try {
      const { data: posts } = await api.get("/api/posts");
      skeleton.style.display = "none";
      grid.style.display = "grid";

      countEl.textContent = `${posts.length} post${posts.length !== 1 ? "s" : ""}`;

      if (!posts.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">✦</div>
            <h3>No stories yet</h3>
            <p>The canvas is blank — be the first to write something remarkable.</p>
            <a href="/editor" class="btn btn-primary">✦ Write First Post</a>
          </div>
        `;
        return;
      }

      grid.innerHTML = posts.map(renderCard).join("");

      // Attach delete listeners
      grid.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const title = btn.dataset.title;
          showConfirm({
            title: "Delete Post?",
            message: `"${title}" will be permanently removed. This can't be undone.`,
            onConfirm: () => deletePost(id, btn.closest(".blog-card")),
          });
        });
      });
    } catch (err) {
      skeleton.style.display = "none";
      grid.style.display = "grid";
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠</div>
          <h3>Failed to load posts</h3>
          <p>Check your connection and try again.</p>
        </div>
      `;
    }
  }

  function renderCard(post) {
    return `
      <article class="blog-card">
        <div class="card-header">
          <span class="category-badge">${escHtml(post.category || "General")}</span>
          <div class="card-actions">
            <button class="btn btn-danger delete-btn" data-id="${post._id}" data-title="${escHtml(post.title)}">✕</button>
          </div>
        </div>
        <h2 class="card-title">${escHtml(post.title)}</h2>
        <p class="card-excerpt">${escHtml(excerpt(post.content))}</p>
        <div class="card-footer">
          <span class="card-date">${formatDate(post.createdAt)}</span>
          <a href="/post?id=${post._id}" class="btn btn-ghost" style="padding:0.4rem 0.9rem;font-size:0.8rem;">Read →</a>
        </div>
      </article>
    `;
  }

  async function deletePost(id, cardEl) {
    try {
      cardEl.style.transition = "all 0.35s ease";
      cardEl.style.transform = "scale(0.92)";
      cardEl.style.opacity = "0";

      await api.delete(`/api/posts/${id}`);
      setTimeout(() => {
        cardEl.remove();
        const remaining = grid.querySelectorAll(".blog-card").length;
        countEl.textContent = `${remaining} post${remaining !== 1 ? "s" : ""}`;
        if (!remaining) loadPosts(); // show empty state
        showToast("Post deleted successfully", "success");
      }, 350);
    } catch {
      cardEl.style.transform = "";
      cardEl.style.opacity = "";
      showToast("Failed to delete post", "error");
    }
  }

  loadPosts();
}

// ─── Page: Single Post (post.html) ───────────────────────────────────────────

if (document.getElementById("postContent")) {
  const id = getParam("id");
  const loadingEl = document.getElementById("postLoading");
  const contentEl = document.getElementById("postContent");
  const errorEl = document.getElementById("postError");

  async function loadPost() {
    if (!id) { showError(); return; }

    try {
      const { data: post } = await api.get(`/api/posts/${id}`);
      document.title = `${post.title} — ZENITH`;

      document.getElementById("postTitle").textContent = post.title;
      document.getElementById("postCategory").textContent = post.category || "General";
      document.getElementById("postDate").textContent = formatDate(post.createdAt);
      document.getElementById("postReadTime").textContent = readTime(post.content);
      document.getElementById("postBody").textContent = post.content;
      document.getElementById("editBtn").href = `/editor?id=${id}`;

      loadingEl.style.display = "none";
      contentEl.style.display = "block";
    } catch {
      showError();
    }
  }

  function showError() {
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
  }

  loadPost();
}

// ─── Page: Editor (editor.html) ───────────────────────────────────────────────

if (document.getElementById("postForm")) {
  const id = getParam("id");
  const form = document.getElementById("postForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitIcon = document.getElementById("submitIcon");
  const editorTitle = document.getElementById("editorTitle");

  // If editing, preload post
  if (id) {
    editorTitle.textContent = "Edit Story";
    submitText.textContent = "Save Changes";
    document.title = "Edit Post — ZENITH";

    api.get(`/api/posts/${id}`)
      .then(({ data }) => {
        document.getElementById("titleInput").value = data.title || "";
        document.getElementById("categoryInput").value = data.category || "General";
        document.getElementById("contentInput").value = data.content || "";
      })
      .catch(() => {
        showToast("Could not load post for editing", "error");
      });
  }

  form.addEventListener("submit", async () => {
    const title = document.getElementById("titleInput").value.trim();
    const category = document.getElementById("categoryInput").value;
    const content = document.getElementById("contentInput").value.trim();

    if (!title || !content) {
      showToast("Title and content are required", "error");
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitIcon.textContent = "◌";
    submitIcon.style.animation = "spin 1s linear infinite";
    submitText.textContent = id ? "Saving…" : "Publishing…";

    try {
      if (id) {
        await api.patch(`/api/posts/${id}`, { title, category, content });
        showToast("Post updated successfully!", "success");
        setTimeout(() => { window.location.href = `/post?id=${id}`; }, 1200);
      } else {
        const { data } = await api.post("/api/posts", { title, category, content });
        showToast("Post published! ✦", "success");
        setTimeout(() => { window.location.href = `/post?id=${data._id}`; }, 1200);
      }
    } catch {
      showToast("Something went wrong. Please try again.", "error");
      submitBtn.disabled = false;
      submitIcon.textContent = "✦";
      submitIcon.style.animation = "";
      submitText.textContent = id ? "Save Changes" : "Publish Post";
    }
  });
}

// ─── HTML Escape ──────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Spinner Keyframe (injected) ──────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
