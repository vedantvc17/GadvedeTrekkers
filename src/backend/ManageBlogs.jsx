import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";

const CATEGORIES = ["Trekking", "Camping", "Tours", "Heritage", "Corporate", "Travel Tips", "Gear & Rentals", "News"];

const DEFAULT = {
  title: "",
  category: "Trekking",
  author: "",
  summary: "",
  content: "",
  tags: "",
  featuredImage: "",
  images: [],
  status: "published",
};

export default function ManageBlogs() {
  const { data: blogs, add, update, remove, toggleActive } = useAdminData("gt_blogs");
  const [form, setForm]       = useState(DEFAULT);
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]   = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [preview, setPreview] = useState(null);

  /* ── helpers ── */
  const openCreate = () => {
    setForm(DEFAULT);
    setEditId(null);
    setShowForm(true);
    setPreview(null);
  };

  const openEdit = (item) => {
    setForm({ ...item, images: item.images || [] });
    setEditId(item.id);
    setShowForm(true);
    setPreview(null);
  };

  const handleCancel = () => {
    setForm(DEFAULT);
    setEditId(null);
    setShowForm(false);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      publishedAt: editId
        ? form.publishedAt
        : new Date().toISOString(),
    };
    editId ? update(editId, payload) : add(payload);
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this blog post?")) remove(id);
  };

  /* ── image uploads ── */
  const handleFeaturedImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => setForm((f) => ({ ...f, featuredImage: ev.target.result }));
    r.readAsDataURL(file);
  };

  const handleGalleryImages = (e) => {
    const files = [...e.target.files];
    Promise.all(
      files.map(
        (f) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = (ev) => res(ev.target.result);
            reader.readAsDataURL(f);
          })
      )
    ).then((imgs) => setForm((f) => ({ ...f, images: [...(f.images || []), ...imgs] })));
  };

  const removeGalleryImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  /* ── filter ── */
  let filtered = blogs;
  if (filterCat) filtered = filtered.filter((b) => b.category === filterCat);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.tags?.toLowerCase().includes(q)
    );
  }

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return "—"; }
  };

  return (
    <div className="adm-page">

      {/* Header */}
      <div className="adm-page-header">
        <h3 className="adm-page-title">📝 Blogs</h3>
        <button className="btn btn-success btn-sm px-3" onClick={openCreate}>
          + New Blog Post
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="adm-form-card mb-4">
          <h5 className="mb-4 fw-bold">
            {editId ? "Edit Blog Post" : "Add New Blog Post"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Title */}
              <div className="col-12">
                <label className="form-label small fw-semibold mb-1">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Top 10 Treks Near Pune for Beginners"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Category + Author + Status */}
              <div className="col-md-4">
                <label className="form-label small fw-semibold mb-1">Category</label>
                <select
                  className="form-select form-select-sm"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold mb-1">Author</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Author name"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold mb-1">Status</label>
                <select
                  className="form-select form-select-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Summary */}
              <div className="col-12">
                <label className="form-label small fw-semibold mb-1">Summary / Excerpt</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={2}
                  placeholder="Brief summary shown on the blog listing page (2-3 sentences)"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
              </div>

              {/* Content */}
              <div className="col-12">
                <label className="form-label small fw-semibold mb-1">
                  Blog Content <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control form-control-sm blog-content-area"
                  rows={14}
                  placeholder="Write your full blog post here. Use blank lines between paragraphs."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
                <div className="d-flex justify-content-between mt-1">
                  <span className="text-muted" style={{ fontSize: 11 }}>
                    {form.content.length} characters
                  </span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm py-0 text-success text-decoration-none"
                    style={{ fontSize: 11 }}
                    onClick={() => setPreview(form.content)}
                  >
                    Preview ↗
                  </button>
                </div>
              </div>

              {/* Preview pane */}
              {preview && (
                <div className="col-12">
                  <div className="adm-blog-preview">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold small">Content Preview</span>
                      <button type="button" className="btn-close btn-sm" onClick={() => setPreview(null)} />
                    </div>
                    {preview.split("\n").filter(Boolean).map((p, i) => (
                      <p key={i} style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>{p}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="col-md-8">
                <label className="form-label small fw-semibold mb-1">Tags</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. trek, pune, beginner, monsoon (comma-separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              {/* Featured image URL */}
              <div className="col-md-4">
                <label className="form-label small fw-semibold mb-1">Featured Image URL</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="https://..."
                  value={typeof form.featuredImage === "string" && !form.featuredImage.startsWith("data:") ? form.featuredImage : ""}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                />
              </div>

              {/* Featured image upload */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">Upload Featured Image</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={handleFeaturedImage}
                />
                {form.featuredImage && (
                  <img
                    src={form.featuredImage}
                    alt="Featured"
                    style={{ marginTop: 8, width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              {/* Gallery images */}
              <div className="col-md-6">
                <label className="form-label small fw-semibold mb-1">Upload Gallery Images</label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImages}
                />
                {form.images?.length > 0 && (
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt=""
                          style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #e2e8f0" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          style={{
                            position: "absolute", top: -6, right: -6,
                            width: 18, height: 18, borderRadius: "50%",
                            background: "#ef4444", border: "none", color: "#fff",
                            fontSize: 11, lineHeight: 1, cursor: "pointer",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm px-4">
                {editId ? "Update Post" : "Publish Post"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      {blogs.length > 0 && (
        <div className="adm-filter-bar mb-3">
          <input
            className="form-control form-control-sm adm-search"
            placeholder="Search blog posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 2 }}
          />
          <select
            className="form-select form-select-sm"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="adm-count-badge">
            {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Blog list */}
      {blogs.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📝</div>
          <p className="adm-empty-text">No blog posts yet.</p>
          <button className="btn btn-success btn-sm" onClick={openCreate}>
            + Write First Post
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          <p className="adm-empty-text">No results for "{search}"</p>
        </div>
      ) : (
        <div className="adm-blog-grid">
          {filtered.map((post) => (
            <div key={post.id} className="adm-blog-card">
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="adm-blog-card-img"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="adm-blog-card-body">
                <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                  <span className="adm-blog-category">{post.category}</span>
                  <span className={`adm-blog-status ${post.status === "draft" ? "adm-blog-status--draft" : ""}`}>
                    {post.status === "draft" ? "Draft" : "Live"}
                  </span>
                </div>
                <h6 className="adm-blog-title">{post.title}</h6>
                {post.summary && (
                  <p className="adm-blog-summary">{post.summary}</p>
                )}
                <div className="adm-blog-meta">
                  {post.author && <span>✍ {post.author}</span>}
                  <span>📅 {fmtDate(post.publishedAt)}</span>
                  {post.images?.length > 0 && <span>🖼 {post.images.length} img{post.images.length > 1 ? "s" : ""}</span>}
                </div>
                {post.tags && (
                  <div className="adm-blog-tags mt-2">
                    {post.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="adm-blog-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="adm-blog-card-footer">
                <button
                  className={`adm-toggle-btn ${post.active !== false ? "adm-toggle-on" : "adm-toggle-off"}`}
                  onClick={() => toggleActive(post.id)}
                >
                  {post.active !== false ? "Live" : "Off"}
                </button>
                <button className="btn btn-outline-primary btn-sm" onClick={() => openEdit(post)}>
                  Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .blog-content-area {
          font-family: 'Georgia', serif;
          font-size: 14px;
          line-height: 1.8;
        }
        .adm-blog-preview {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 20px;
          max-height: 300px;
          overflow-y: auto;
        }
        .adm-blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }
        .adm-blog-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }
        .adm-blog-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
        }
        .adm-blog-card-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .adm-blog-card-body {
          padding: 14px 14px 8px;
          flex: 1;
        }
        .adm-blog-card-footer {
          padding: 10px 14px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .adm-blog-category {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #16a34a;
          background: #f0fdf4;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .adm-blog-status {
          font-size: 10px;
          font-weight: 600;
          color: #16a34a;
          background: #dcfce7;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .adm-blog-status--draft {
          color: #d97706;
          background: #fef3c7;
        }
        .adm-blog-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.4;
          margin: 6px 0 4px;
        }
        .adm-blog-summary {
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 6px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .adm-blog-meta {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .adm-blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .adm-blog-tag {
          font-size: 10px;
          color: #475569;
          background: #f1f5f9;
          padding: 2px 7px;
          border-radius: 10px;
        }
        .adm-filter-bar {
          display: flex;
          gap: 10px;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
