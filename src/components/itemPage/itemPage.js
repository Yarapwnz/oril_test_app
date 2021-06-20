import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Container, Row, Col } from "reactstrap";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    buttons: {
      position: "flex",
      margin: 0,
    },
  },
}));

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const LineChart = () => {
  const [type, setType] = useState("week");
  const [items, setItems] = useState([]);
  const [data, setData] = useState(null);
  const params = useParams();

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [sum, setSum] = useState(0);
  const [avg, setAvg] = useState(0);

  const showByDate = (date, labels) => {
    const now = new Date();

    const filtered = items
      .filter((d) => {
        return (
          new Date(d.date) <= now &&
          new Date(d.date) >= date &&
          d.curency !== "null"
        );
      })
      .map((d) => {
        return parseFloat(d.curency);
      });

    const max = Math.max(...filtered);
    const min = Math.min(...filtered);
    const sum = filtered.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const avg = sum / filtered.length;

    setMin(min);
    setMax(max);
    setSum(sum);
    setAvg(avg);

    console.log("max", max, min, sum.toFixed(2), avg.toFixed(2));

    setData({
      labels: labels,
      datasets: [
        {
          data: filtered,
          fill: true,
          backgroundColor: "rgb(127,197, 252)",
          borderColor: "blue",
          label: "Currency",
        },
      ],
    });
  };

  const showByWeek = () => {
    setType("week");
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDay() - 7);

    showByDate(lastWeek, weekDays);
  };

  const showByMonth = () => {
    setType("month");
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getMonth() - 1);

    showByDate(lastMonth, monthNames);
  };

  const showByYear = () => {
    setType("year");
    const lastMonth = new Date();
    lastMonth.setFullYear(lastMonth.getFullYear() - 1);

    showByDate(lastMonth, [lastMonth.getFullYear(), new Date().getFullYear()]);
  };

  useEffect(() => {
    async function fetchList() {
      const res = await fetch(
        `https://oril-coins-test.herokuapp.com/item/${params.id}`
      );
      const result = await res.json();

      setItems(result.data);
    }

    fetchList();
    showByYear();
  }, []);

  const classes = useStyles();
  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="6">
            <div className={classes.root}>
              <div className="header">
                <h1 className="title">Revenue</h1>
                <ToggleButton
                  color="primary"
                  align="right"
                  onClick={showByWeek}
                  selected={type === "week"}
                >
                  Week
                </ToggleButton>
                <ToggleButton
                  color="primary"
                  align="right"
                  onClick={showByMonth}
                  selected={type === "month"}
                >
                  Month
                </ToggleButton>
                <ToggleButton
                  color="primary"
                  align="right"
                  onClick={showByYear}
                  selected={type === "year"}
                >
                  Year
                </ToggleButton>
              </div>
            </div>
          </Col>
        </Row>
        <Line data={data} options={options} width={500} />

        <div className={classes.root}>
          <p>Total</p>
          <b className={classes.bBigNumber}>${sum.toFixed(2)}</b>
        </div>
        <div className={classes.root}>
          <b>Min </b>
          <b> Medium </b>
          <b> Max</b>
        </div>
        <div className={classes.root}>
          <b>${min}</b>
          <b> ${avg.toFixed(2)} </b>
          <b> ${max} </b>
        </div>
      </Container>
    </>
  );
};

export default LineChart;
