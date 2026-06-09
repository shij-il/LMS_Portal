import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const COURSE_EMOJIS = ["🚀", "💡", "🎯", "🔬", "🎨", "💻", "🌍", "🔧", "📊", "🧠"];
const LEVEL_COLORS = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger"
};

function CourseCard({ course, onEnroll, onDelete, onEdit, showActions, enrolled }) {
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  const emoji = COURSE_EMOJIS[course.title?.charCodeAt(0) % COURSE_EMOJIS.length] || "📚";
  const level = course.level || "Beginner";
  const levelColor = LEVEL_COLORS[level] || "primary";

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post("/enrollments", { courseId: course._id });
      toast.success("🎉 Enrolled successfully!");
      onEnroll?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="course-card slide-up">
      <div className="course-card-thumb" style={{
        background: `linear-gradient(135deg, hsl(${course.title?.charCodeAt(0) * 5 % 360}, 60%, 35%) 0%, hsl(${(course.title?.charCodeAt(0) * 5 + 60) % 360}, 70%, 25%) 100%)`
      }}>
        <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
          {emoji}
        </span>
        <div style={{
          position: "absolute", top: "0.75rem", left: "0.75rem", zIndex: 1
        }}>
          <span className={`badge badge-${levelColor}`}>{level}</span>
        </div>
        {course.category && (
          <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", zIndex: 1 }}>
            <span className="badge" style={{ background: "rgba(0,0,0,0.4)", color: "white" }}>
              {course.category}
            </span>
          </div>
        )}
      </div>

      <div className="course-card-body">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        <div className="course-meta">
          <span className="course-meta-item">
            👨‍🏫 {course.instructor?.name || "Instructor"}
          </span>
          <span className="course-meta-item">
            ⏱ {course.duration || "Self-paced"}
          </span>
        </div>
      </div>

      <div className="course-card-footer">
        {showActions && user?.role === "instructor" ? (
          <>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => onEdit?.(course)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              style={{ flex: 1 }}
              onClick={() => onDelete?.(course._id)}
            >
              🗑 Delete
            </button>
          </>
        ) : enrolled ? (
          <button className="btn btn-success btn-sm" style={{ flex: 1, cursor: "default" }} disabled>
            ✅ Enrolled
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
