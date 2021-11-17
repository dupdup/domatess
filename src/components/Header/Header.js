import { useEffect, useState } from "react";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import Box from "../Box";

function Header(props) {
  const { tasks } = props;
  console.log(tasks);
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

export default Header;
