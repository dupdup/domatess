import { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import moment from "moment/moment.js";

import Header from "../components/Header";
import TaskManager from "../components/TaskManager";

function PageTodolist() {
  // Task state has to be lifted to be at the App level
  // because Header also needs to know the task state to display
  // no. of undone tasks. It cannot be contained within TaskManager
  // as child components cannot pass props to their parent components.
  const [tasks, setTasksState] = useState([]);
  const [products, setProductsState] = useState([]);
  const [customerId, setCustomerIdState] = useState([]);

  function setTasks(newTasks) {
    setTasksState(newTasks);
  }

  function getOrderDate() {
    var date = moment().hour() < 9 ? moment() : moment().add(1, "days");
    return date.format("DD-MM-YYYY");
  }

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
          setCustomerIdState(doc.data()[email]);
          const docRef = db.collection("/tasks").doc(dataId);

          docRef.get().then((doc) => {
            if (doc.exists) {
              console.log({ x: doc.data().tasks });
              setTasksState(doc.data().tasks);
            }
          });
        }
      });
    infoDocRef
      .doc("products")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setProductsState(doc.data().sebze);
        } else {
          setProductsState([]);
        }
      });
  }, []);

  return (
    <>
      <main>
        <TaskManager
          tasks={tasks}
          setTasks={setTasks}
          products={products}
          customerId={customerId}
        />
        <Header />
      </main>
    </>
  );
}

export default PageTodolist;
