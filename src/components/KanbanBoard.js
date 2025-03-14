import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "../styles/KanbanBoard.css";

const initialData = {
  todo: { name: "To Do", items: [] },
  inprogress: { name: "In Progress", items: [] },
  inreview: { name: "In Review", items: [] },
  done: { name: "Done", items: [] },
};

function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState(false);
  const [bounty, setBounty] = useState("");
  const [skills, setSkills] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [points, setPoints] = useState("");
  const [reviewers, setReviewers] = useState("");

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = Array.from(column.items);
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
    } else {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removed] = sourceItems.splice(source.index, 1);
      removed.status = destColumn.name;
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      });
    }
  };

  const openCreateModal = (columnId) => {
    setCurrentColumn(columnId);
    setStatus(columns[columnId].name);
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    resetCreateFields();
  };

  const resetCreateFields = () => {
    setTaskName("");
    setDescription("");
    setPermissions(false);
    setBounty("");
    setSkills("");
    setSubtasks([]);
    setSubtaskInput("");
    setStatus("");
    setAssignee("");
    setPriority("");
    setPoints("");
    setReviewers("");
    setTags([]);
    setTagInput("");
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim() === "") return;
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput("");
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const createTask = (e) => {
    e.preventDefault();
    if (taskName.trim() === "") return;
    const newTaskId = `${currentColumn}-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: taskName,
      description,
      permissions,
      bounty,
      skills,
      subtasks,
      status,
      assignee,
      priority,
      points,
      reviewers,
      tags,
    };
    const column = columns[currentColumn];
    const updatedItems = [...column.items, newTask];
    setColumns({
      ...columns,
      [currentColumn]: { ...column, items: updatedItems },
    });
    closeCreateModal();
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => (
          <div className="kanban-column" key={columnId}>
            <h2 className="column-title">{column.name}</h2>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  className="droppable-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? "#d3e3fc" : "#f0f0f0",
                    padding: 8,
                    borderRadius: 4,
                    minHeight: 300,
                  }}
                >
                  {column.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="kanban-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            backgroundColor: snapshot.isDragging
                              ? "#a8d1ff"
                              : "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 4,
                            ...provided.draggableProps.style,
                          }}
                          onClick={() => openTaskDetail(item)}
                        >
                          <div className="task-title">{item.content}</div>
                          {item.description && (
                            <div className="task-desc">{item.description}</div>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className="task-tags">
                              Tags: {item.tags.join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <button
              className="add-task-button"
              onClick={() => openCreateModal(columnId)}
            >
              +
            </button>
          </div>
        ))}
      </DragDropContext>

      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container create-task-modal">
            <div className="modal-left">
              <div className="top-row">
                <button
                  type="button"
                  className={`inline-btn ${permissions ? "active" : ""}`}
                  onClick={() => setPermissions(!permissions)}
                >
                  Permissions
                </button>
                <div className="inline-btn">
                  <label style={{ marginRight: "5px" }}>Bounty:</label>
                  <input
                    type="number"
                    min="0"
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    style={{ width: "70px" }}
                  />
                </div>
                <div className="inline-btn">
                  <label style={{ marginRight: "5px" }}>Skills:</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter a task name..."
                className="task-name-input"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <textarea
                className="description-input"
                placeholder="Write your description here. Type '/' for commands."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="subtask-section">
                <label>Subtasks:</label>
                <ul>
                  {subtasks.map((st, idx) => (
                    <li key={idx}>
                      {st}{" "}
                      <button
                        type="button"
                        className="remove-subtask-btn"
                        onClick={() => removeSubtask(idx)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    placeholder="Add a subtask"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="inline-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-right">
              <div className="side-field">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="side-field">
                <label>Assignee</label>
                <input
                  type="text"
                  placeholder="Select assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>
              <div className="side-field">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select a priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="side-field">
                <label>Task Points</label>
                <input
                  type="number"
                  placeholder="Estimate task effort"
                  min="0"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </div>
              <div className="side-field">
                <label>Tags</label>
                <div className="tag-input-container">
                  {tags.map((tag, i) => (
                    <span key={i} className="tag-pill">
                      {tag}
                      <button
                        type="button"
                        className="remove-tag-btn"
                        onClick={() => removeTag(i)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Press Enter to add tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>
              <div className="side-field">
                <label>Reviewers</label>
                <input
                  type="text"
                  placeholder="Add reviewers"
                  value={reviewers}
                  onChange={(e) => setReviewers(e.target.value)}
                />
              </div>
              <div className="create-buttons-row">
                <button onClick={closeCreateModal} className="cancel-btn-sm">
                  Cancel
                </button>
                <button onClick={createTask} className="create-btn-sm">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {detailModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-container detail-task-modal">
            <div className="modal-left">
              <h2>{selectedTask.content}</h2>
              <div className="detail-badges">
                {selectedTask.permissions && (
                  <span className="badge">Permissions</span>
                )}
                {selectedTask.bounty && (
                  <span className="badge">Bounty: {selectedTask.bounty}</span>
                )}
                {selectedTask.skills && (
                  <span className="badge">Skills: {selectedTask.skills}</span>
                )}
              </div>
              <p className="detail-description">
                {selectedTask.description || "No description provided."}
              </p>
              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div className="subtask-section">
                  <h4>Subtasks</h4>
                  <ul>
                    {selectedTask.subtasks.map((st, idx) => (
                      <li key={idx}>{st}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="detail-tabs">
                <button className="detail-tab-btn">Activity</button>
                <button className="detail-tab-btn">Work</button>
                <button className="detail-tab-btn">Discuss</button>
              </div>
            </div>
            <div className="modal-right">
              <div className="side-field">
                <label>Status</label>
                <div className="detail-value">{selectedTask.status}</div>
              </div>
              <div className="side-field">
                <label>Assignee</label>
                <div className="detail-value">
                  {selectedTask.assignee || "Unassigned"}
                </div>
              </div>
              <div className="side-field">
                <label>Priority</label>
                <div className="detail-value">
                  {selectedTask.priority || "None"}
                </div>
              </div>
              <div className="side-field">
                <label>Task Points</label>
                <div className="detail-value">
                  {selectedTask.points || "N/A"}
                </div>
              </div>
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="side-field">
                  <label>Tags</label>
                  <div className="detail-tags">
                    {selectedTask.tags.map((tag, i) => (
                      <span key={i} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="side-field">
                <label>Reviewers</label>
                <div className="detail-value">
                  {selectedTask.reviewers || "None"}
                </div>
              </div>
            </div>
            <button className="detail-close-btn" onClick={closeDetailModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
