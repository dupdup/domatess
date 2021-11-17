import React, { useState } from "react";
import { firebase } from "@firebase/app";
import { groupBy, sortBy } from "lodash";
import moment from "moment";
function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState("Yükleniyor...");

  function getOrderDate() {
    var date = moment().hour() < 9 ? moment() : moment().add(1, "days");
    return date.format("DD-MM-YYYY");
  }

  useState(() => {
    console.log("here");
    const db = firebase.firestore();
    let dborders = [];

    db.collection("/tasks")
      .get()
      .then((x) => {
        x.forEach((a) => {
          dborders.push(...a.data().tasks);
        });
      })
      .then((a) => {
        console.log(groupBy(orders, (n) => n.orderDate + n.description));
      })
      .then(() => {
        let tomorrowOrders = dborders.filter(
          (n) => n.orderDate === getOrderDate()
        );
        setOrders(tomorrowOrders);
        let sum = tomorrowOrders.reduce(function (total, cv) {
          if (total[cv.description] !== undefined) {
            total[cv.description] =
              Number(cv.quantity) + Number(total[cv.description]);
          } else total[cv.description] = Number(cv.quantity);
          return total;
        }, {});
        console.log(groupBy(tomorrowOrders, (n) => n.description));
        setSummary(sum);
      });
  });

  return (
    <>
      <table style={{ margin: "0 auto", width: "100%" }}>
        <thead>
          <tr>
            <th>Kg/Adet</th>
            <th>Ürün</th>
            <th>Firma</th>
            <th>Kullanıcı</th>
          </tr>
        </thead>
        <tbody>
          {sortBy(orders, (n) => n.description + n.customerId).map(
            (order, index) => (
              <tr key={index}>
                <td>{order.quantity}</td>
                <td>{order.description}</td>
                <td>{order.customerId}</td>
                <td>{order.orderUser}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {JSON.stringify(summary)}
    </>
  );
}

export default Dashboard;
