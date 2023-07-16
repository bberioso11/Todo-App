import React, { useRef, useState } from "react";

const TodoItems = ({ todo, deleteBtn, saveBtn }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editInput, setEditInput] = useState(todo.item);
  const editInputRef = useRef();
  const [error, setError] = useState("");

  const saveEdit = () => {
    if (!editInput) {
      setError("Todo input cannot be empty!");
      editInputRef.current.focus();
      return;
    }
    saveBtn(todo.id, editInput);
    setIsEdit(false);
    setError("");
  };

  const handleSetIsEdit = () => {
    setIsEdit(true);
    setTimeout(() => editInputRef.current.focus(), 100);
  };
  return (
    <li className="mb-2">
      <div className="d-sm-flex justify-content-between">
        <div>
          {isEdit ? (
            <input
              ref={editInputRef}
              onChange={(event) => setEditInput(event.target.value)}
              value={editInput}
              type="text"
              className="form-control"
            />
          ) : (
            <span>{todo.item}</span>
          )}
          {error ? (
            <div className="alert alert-danger p-1 my-2" role="alert">
              <span className="fw-light">{error}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-1 mt-sm-0">
          <button
            onClick={() => (isEdit ? saveEdit() : handleSetIsEdit())}
            className="btn btn-sm btn-success mx-2">
            {isEdit ? "Save" : "Edit"}
          </button>
          <button
            onClick={() => deleteBtn(todo.id)}
            className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItems;
