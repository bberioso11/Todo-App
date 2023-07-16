import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import TodoItems from "./TodoItems";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

const reducer = (state, action) => {
  switch (action.type) {
    case "setTodo": {
      return { todos: action.data };
    }
    case "add": {
      const list = [{ id: action.id, item: action.item }, ...state.todos];
      return { todos: list };
    }
    case "delete": {
      const newList = state.todos.filter((todo) => todo.id !== action.id);
      return { todos: newList };
    }
    case "saveEdit": {
      const updatedList = state.todos.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, item: action.data };
        }
        return todo;
      });
      return { todos: updatedList };
    }
  }
};

const TodoList = () => {
  const [todoInput, setTodoInput] = useState("");
  const todoInputRef = useRef();
  const [list, dispatchList] = useReducer(reducer, { todos: [] });
  const [error, setError] = useState("");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  useEffect(() => todoInputRef.current.focus(), []);

  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      dispatchList({
        type: "setTodo",
        data: JSON.parse(localTodos),
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(list.todos));
  }, [list]);

  const addBtn = () => {
    if (!todoInput) {
      setError("Todo input cannot be empty!");
      todoInputRef.current.focus();
      return;
    }
    dispatchList({
      type: "add",
      item: todoInput,
      id: uuidv4(),
    });
    Toast.fire({
      icon: "success",
      title: "ToDo Added Successfully",
    });
    setTodoInput("");
    setError("");
  };

  const deleteBtn = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatchList({
          type: "delete",
          id: id,
        });
        Swal.fire("Deleted!", "Todo has been deleted.", "success");
      }
    });
  };

  const saveBtn = (id, data) => {
    dispatchList({
      type: "saveEdit",
      id: id,
      data: data,
    });
    Toast.fire({
      icon: "success",
      title: "ToDo Save Successfully",
    });
  };
  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <div className="border shadow m-3 p-3">
          <div className="d-flex justify-content-center">
            <p className="fs-3 fw-semibold">ToDo App</p>
          </div>
          <div className="d-flex justify-content-center ">
            <div>
              <input
                ref={todoInputRef}
                onChange={(event) => setTodoInput(event.target.value)}
                value={todoInput}
                type="text"
                className="form-control"
                placeholder="Enter your todo"
              />
              {error ? (
                <div className="alert alert-danger p-1 my-2" role="alert">
                  <span className="fw-light">{error}</span>
                </div>
              ) : null}
            </div>
            <div>
              <button onClick={addBtn} className="btn btn-primary ms-2">
                Add
              </button>
            </div>
          </div>
          <div className="mt-3">
            <ul className="">
              {list.todos.map((todo) => (
                <TodoItems
                  key={todo.id}
                  todo={todo}
                  deleteBtn={deleteBtn}
                  saveBtn={saveBtn}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoList;
