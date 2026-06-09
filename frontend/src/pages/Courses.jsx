import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";

const CATEGORIES = ["All", "General", "Programming", "Design", "Business", "Science", "Mathematics", "Language", "Other"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [coursesRes, myRes] = await Promise.all([
        api.get("/courses"),
        api.get("/enrollments/my-courses").catch(() => ({ data: [] }))
      ]);
      setCourses(coursesRes.data);
      setEnrolledIds(new Set(myRes.data.map((e) => e.course?._id)));
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const matchLvl = level === "All" || c.level === level;
    return matchSearch && matchCat && matchLvl;
  });

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">📚 Browse Courses</h1>
          <p className="page-subtitle">Discover and enroll in courses that match your interests</p>
        </div>

        {/* Filters */}
        <div className="card card-body" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div className="search-bar" style={{ flex: "1 1 240px" }}>
              <span className="search-icon">🔍</span>
              <input
                className="form-control"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category */}
            <div style={{ flex: "0 0 auto" }}>
              <select
                className="form-control form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ minWidth: 160 }}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Level */}
            <div style={{ flex: "0 0 auto" }}>
              <select
                className="form-control form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{ minWidth: 140 }}
              >
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Count */}
            <div style={{ marginLeft: "auto", color: "var(--text-muted)", fontSize: "0.875rem", flexShrink: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong> course{filtered.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No courses found</h3>
              <p className="empty-state-text">Try adjusting your search or filter criteria</p>
              <button
                className="btn btn-secondary"
                onClick={() => { setSearch(""); setCategory("All"); setLevel("All"); }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                enrolled={enrolledIds.has(course._id)}
                onEnroll={fetchAll}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Courses;
