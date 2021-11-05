import React, { useEffect, useState } from "react";
import { Button, Select, TextField } from "@material-ui/core";
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
        created: firebase.firestore.Timestamp.now()
      }
    ];
    setNewQuantity("");
    setNewTaskText("");
    setTasks(newTasks);
  }

  // Hook to watch for any changes in tasks. If there are changes,
  // an update to our Firestore database will be dispatched
  useEffect(() => {
    const db = firebase.firestore();
    const infoDocRef = db.collection("/info");

    infoDocRef
      .doc("users")
      .get(firebase.auth().currentUser?.email)
      .then((doc) => {
        const email = firebase.auth().currentUser?.email;
        console.log(email);
        if (doc.exists) {
          const dataId = getOrderDate() + "-" + doc.data()[email];
          const docRef = db.collection("/tasks").doc(dataId);
          docRef.set({ tasks: tasks });
        } else {
          setTasks([]);
        }
      });
  }, [tasks]);

  function getOrderDate() {
    var date = moment().hour() < 9 ? moment() : moment().add(1, "days");
    return date.format("DD-MM-YYYY");
  }

  return (
    <>
      <Box>
        <h2>Add Tasks</h2>
        <form className={styles.addTaskForm} onSubmit={handleAddTask}>
          <TextField
            type="number"
            className={styles.descTextField}
            label="Quantity"
            value={newQuantity}
            onChange={(event) => {
              setNewQuantity(event.target.value);
            }}
          />
          <Select
            className={styles.descTextField}
            label="Description"
            value={newTaskText}
            onChange={(event) => {
              setNewTaskText(event.target.value);
            }}
          >
            {products.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>
      </Box>

      <Box>
        <h2>{getOrderDate()}</h2>
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} setTasks={setTasks} />
        ) : (
          <p>No tasks yet! Add one above!</p>
        )}
      </Box>
    </>
  );
}

function TaskList(props) {
  const { tasks, setTasks } = props;

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
  }

  return (
    <table style={{ margin: "0 auto", width: "100%" }}>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Task</th>
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
