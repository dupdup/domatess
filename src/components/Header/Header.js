import { useEffect, useState } from "react";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Box from "../Box";
import { firebase } from "@firebase/app";
import groupBy from "lodash/groupBy";

function Header(props) {
  const { tasks } = props;
  return (
    <header>
      <div style={{ display: "flex", flexFlow: "row nowrap" }}>
        <FirebaseAuthConsumer>
          {({ user }) => <OverviewBox tasks={tasks} user={user} />}
        </FirebaseAuthConsumer>
      </div>
    </header>
  );
}

function OverviewBox(props) {
  // This is passed all the way down from App
  const { tasks, user } = props;

  const [name, setName] = useState("Loading name...");

  // We do not need to use useState here, because we do not need to keep
  // a state of the task list length. This is purely a simple calculation
  // done on the passed prop.
  const taskListLength =
    tasks && tasks.filter((task) => !task.isComplete).length;

  useState(() => {
    console.log("22");
    const db = firebase.firestore();
    let orders = [];
    db.collection("/tasks")
      .get()
      .then((x) => {
        x.forEach((a) => {
          orders.push(...a.data().tasks);
          console.log(a.data());
        });
      })
      .then((a) => {
        console.log(a);
        console.log(groupBy(orders, (n) => n.orderDate));
      });
  });
  // This effect runs on component mount, so that it will fetch data from
  // localStorage when it is loaded.
  useEffect(() => {
    if (user?.displayName) {
      setName(user?.displayName);
    }
  }, [user]);

  return (
    <Box>
      <h2>Overview</h2>
      <p>
        Welcome back, <strong>{name}</strong>!
      </p>
      <p>
        You have{" "}
        <strong>
          {taskListLength} task{taskListLength === 1 ? "" : "s"}
        </strong>{" "}
        that {taskListLength === 1 ? "is" : "are"} not complete.
      </p>
    </Box>
  );
}

function CatFactBox() {
  const [catFact, setCatFact] = useState("Loading cat fact...");

  // useEffect first argument: the effect that you want to run
  // useEffect second argument: the dependency array, i.e. the
  // values it is watching for any changes

  // In this case, the dependency array is empty (i.e. it is watching nothing)
  // so this effect will only run when the page has mounted (finished loading)
  useEffect(() => {
    fetch("https://catfact.ninja/fact")
      .then((response) => response.json())
      .then((data) => setCatFact(data.fact))
      .catch((error) =>
        setCatFact(`Unable to retrieve cat fact. Error: ${error}`)
      );
  }, []);

  return (
    <Box>
      <h2>Cat Fact of the Day</h2>
      <p>{catFact}</p>
    </Box>
  );
}

export default Header;
