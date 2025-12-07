import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:3001";

async function apiFetch(path, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  if (config.method === "GET" || config.method === "HEAD") {
    delete config.body;
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      if (data && data.error) {
        message = data.error;
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [groupFilter, setGroupFilter] = useState("");
  const [averageAge, setAverageAge] = useState(null);

  const [backupStatus, setBackupStatus] = useState({
    isRunning: false,
    pendingIntervals: 0
  });

  const handleError = (error) => {
    toast.error(error.message || "Unexpected error");
  };

  const handleSuccess = (message) => {
    toast.success(message);
  };

  const loadAllStudents = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/api/students");
      setStudents(data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllStudents().catch(handleError);
    refreshBackupStatus().catch(handleError);
  }, []);

  const resetForm = () => {
    setName("");
    setAge("");
    setGroup("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !age || !group) {
      toast.warn("Please fill all fields");
      return;
    }

    const payload = {
      name: name.trim(),
      age: Number(age),
      group: Number(group)
    };

    setIsLoading(true);

    try {
      if (editingId) {
        const updated = await apiFetch(`/api/students/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        setStudents((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s))
        );
        handleSuccess("Student updated");
      } else {
        const created = await apiFetch("/api/students", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        setStudents((prev) => [...prev, created]);
        handleSuccess("Student added");
      }

      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setAge(String(student.age));
    setGroup(String(student.group));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) {
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch(`/api/students/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      handleSuccess("Student deleted");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterByGroup = async () => {
    if (!groupFilter) {
      loadAllStudents().catch(handleError);
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch(`/api/students/group/${groupFilter}`);
      setStudents(data || []);
      handleSuccess("Filtered by group");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAverageAge = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/api/students/average-age");
      setAverageAge(data?.averageAge ?? null);
      handleSuccess("Average age calculated");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToFile = async () => {
    setIsLoading(true);
    try {
      await apiFetch("/api/students/save", { method: "POST" });
      handleSuccess("Students saved to file");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromFile = async () => {
    setIsLoading(true);
    try {
      await apiFetch("/api/students/load", { method: "POST" });
      await loadAllStudents();
      handleSuccess("Students loaded from file");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceCollection = async () => {
    if (!window.confirm("Replace entire collection with demo data?")) {
      return;
    }

    const demoStudents = [
      { id: "1001", name: "Demo Alice", age: 21, group: 1 },
      { id: "1002", name: "Demo Bob", age: 22, group: 2 },
      { id: "1003", name: "Demo Carol", age: 23, group: 2 }
    ];


    setIsLoading(true);
    try {
      await apiFetch("/api/students", {
        method: "PUT",
        body: JSON.stringify(demoStudents)
      });
      setStudents(demoStudents);
      handleSuccess("Collection replaced with demo data");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startBackup = async () => {
    setIsLoading(true);
    try {
      await apiFetch("/api/backup/start", { method: "POST" });
      handleSuccess("Backup started");
      await refreshBackupStatus();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopBackup = async () => {
    setIsLoading(true);
    try {
      await apiFetch("/api/backup/stop", { method: "POST" });
      handleSuccess("Backup stopped");
      await refreshBackupStatus();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function refreshBackupStatus() {
    try {
      const data = await apiFetch("/api/backup/status");
      setBackupStatus({
        isRunning: Boolean(data.isRunning),
        pendingIntervals: data.pendingIntervals ?? 0
      });
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Management UI</h1>
        <p>Frontend for Practical Task 3 (HTTP Server + Express API)</p>
      </header>

      <section className="panel">
        <h2>Data Controls</h2>
        <div className="buttons-row">
          <button onClick={loadAllStudents} disabled={isLoading}>
            Reload students
          </button>
          <button onClick={handleSaveToFile} disabled={isLoading}>
            Save to file
          </button>
          <button onClick={handleLoadFromFile} disabled={isLoading}>
            Load from file
          </button>
          <button onClick={handleReplaceCollection} disabled={isLoading}>
            Replace with demo collection (PUT)
          </button>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>
              Filter by group:
              <input
                type="number"
                min="1"
                value={groupFilter}
                onChange={(e) => setGroupFilter(Math.max(1, Number(e.target.value)))}
                placeholder="Group id"
              />
            </label>
            <button onClick={handleFilterByGroup} disabled={isLoading}>
              Apply
            </button>
          </div>

          <div className="filter-group">
            <button onClick={handleAverageAge} disabled={isLoading}>
              Calculate average age
            </button>
            {averageAge !== null && (
              <span className="average-badge">
                Average age: {averageAge.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>{editingId ? "Edit student" : "Add new student"}</h2>
        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student name"
            />
          </label>

          <label>
            Age
            <input
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
              placeholder="Age"
            />
          </label>

          <label>
            Group
            <input
              type="number"
              min="1"
              value={group}
              onChange={(e) => setGroup(Math.max(1, Number(e.target.value)))}
              placeholder="Group id"
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="secondary"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Students ({students.length})</h2>
        {isLoading && <p>Loading...</p>}
        {!isLoading && students.length === 0 && <p>No students found.</p>}

        {!isLoading && students.length > 0 && (
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.group}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(student)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(student.id)}
                      disabled={isLoading}
                      className="danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel">
        <h2>Backup control</h2>
        <div className="backup-row">
          <div className="backup-buttons">
            <button onClick={startBackup} disabled={isLoading}>
              Start backup
            </button>
            <button onClick={stopBackup} disabled={isLoading}>
              Stop backup
            </button>
            <button
              onClick={() => refreshBackupStatus()}
              disabled={isLoading}
            >
              Refresh status
            </button>
          </div>
          <div className="backup-status">
            <span>
              Status:{" "}
              <strong>
                {backupStatus.isRunning ? "Running" : "Stopped"}
              </strong>
            </span>
            <span>Pending intervals: {backupStatus.pendingIntervals}</span>
          </div>
        </div>
      </section>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
