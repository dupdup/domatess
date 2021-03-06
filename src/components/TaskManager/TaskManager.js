import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { firebase } from "@firebase/app";
import moment from "moment/moment.js";

import Box from "../Box";

import styles from "./TaskManager.module.css";

function TaskManager(props) {
  // Our tasks and setTasks is now passed down from App
  const { tasks, setTasks } = props;
  const { products } = props;
  const { customerId } = props;
  const [newTaskText, setNewTaskText] = useState("");

  const [newQuantity, setNewQuantity] = useState("");

  useState(() => {
    const db = firebase.firestore();
    const dataId = getOrderDate() + "-" + customerId;
    const tasksRef = db.collection("/tasks").doc(dataId);
    console.log(dataId);
    tasksRef.get("tasks").then((tasks) => {
      console.log({ a: tasks.data() });
      if (tasks.exists) setTasks(tasks.data().tasks);
      else setTasks([]);
    });
  });

  function handleAddTask(event) {
    // React honours default browser behavior and the
    // default behaviour for a form submission is to
    // submit AND refresh the page. So we override the
    // default behaviour here as we don't want to refresh
    event.preventDefault();
    addTask(newQuantity, newTaskText, firebase);
  }

  function addTask(quantity, description) {
    const newTasks = [
      // the ... operator is called the spread operator
      // what we are doing is creating a brand new array of
      // tasks, that is different from the previous array
      // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      ...tasks,
      {
        quantity: quantity,
        description: description,
        customerId: customerId,
        orderDate: getOrderDate(),
        orderUser: firebase.auth().currentUser?.email,
        created: firebase.firestore.Timestamp.now()
      }
    ];
    setNewQuantity("");
    setNewTaskText("");
    setTasks(newTasks);
    const dataId = getOrderDate() + "-" + customerId;
    const db = firebase.firestore();
    const tasksRef = db.collection("/tasks").doc(dataId);
    tasksRef.set({ tasks: newTasks });
  }

  function getOrderDate() {
    var date = moment().hour() < 9 ? moment() : moment().add(1, "days");
    return date.format("DD-MM-YYYY");
  }

  function deleteTask(toToggleTask, toToggleTaskIndex) {
    const newTasks = [
      // Once again, this is the spread operator
      ...tasks.slice(0, toToggleTaskIndex),
      ...tasks.slice(toToggleTaskIndex + 1)
    ];
    // We set new tasks in such a complex way so that we maintain immutability
    // Read this article to find out more:
    // https://blog.logrocket.com/immutability-in-react-ebe55253a1cc/
    setTasks(newTasks);
    const dataId = getOrderDate() + "-" + customerId;
    const db = firebase.firestore();
    const tasksRef = db.collection("/tasks").doc(dataId);
    tasksRef.set({ tasks: newTasks });
  }

  return (
    <>
      <Box>
        <h3>??r??n Ekle</h3>
        <form className={styles.addTaskForm} onSubmit={handleAddTask}>
          <TextField
            type="number"
            className={styles.descTextField}
            label="Kg/Adet"
            value={newQuantity}
            onChange={(event) => {
              setNewQuantity(event.target.value);
            }}
          />
          <Autocomplete
            className={styles.autocomplete}
            options={products}
            onChange={(event, newValue) => {
              setNewTaskText(newValue);
            }}
            inputValue={newTaskText}
            onInputChange={(event, newInputValue) => {
              setNewTaskText(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="??r??n"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Button
            disabled={!newTaskText || !newQuantity}
            type="submit"
            variant="contained"
            color="primary"
          >
            Ekle
          </Button>
        </form>
      </Box>

      <Box>
        <h2>{getOrderDate()}</h2>
        {tasks && tasks.length > 0 ? (
          <TaskList tasks={tasks} deleteTask={deleteTask} />
        ) : (
          <p>No tasks yet! Add one above!</p>
        )}
      </Box>
    </>
  );
}

function TaskList(props) {
  const { tasks } = props;
  const { deleteTask } = props;
  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>Kg/Adet</th>
          <th>??r??n</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          // We should specify key here to help react identify
          // what has updated
          // https://reactjs.org/docs/lists-and-keys.html#keys
          <tr key={index}>
            <td>{task.quantity}</td>
            <td>{task.description}</td>
            <td>
              <Button
                color="primary"
                text="sil"
                onClick={() => deleteTask(task, index)}
              >
                Sil
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TaskManager;
