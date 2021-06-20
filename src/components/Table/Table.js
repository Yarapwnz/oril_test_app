import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "date", numeric: false, disablePadding: false, label: "Date" },
  { id: "isActive", numeric: true, disablePadding: false, label: "State" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "75%",
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: 300,
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 550,
    position: "flex",
    margin: 0,
  },
  visuallyHidden: {
    border: -1,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  checkActive: {
    color: "blue",
  },
  checkDisabled: {
    color: "red",
  },
  aLinkItem: {
    textDecoration: "none underline",
    color: "black",
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [initialList, setInitialList] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    async function fetchList() {
      const res = await fetch("https://oril-coins-test.herokuapp.com/list");
      const data = await res.json();

      setInitialList(data);
      setList(data);
    }
    fetchList();
  }, []);

  function searchField(searchField) {
    setSearchTerm(searchField);

    if (!searchField) {
      setList(initialList);
    } else {
      setList(
        list.filter((item) => {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        <form className={classes.root} noValidate autoComplete="on">
          <div>
            <TextField
              id="outlined-textarea"
              label="Search"
              placeholder="Search"
              multiline
              variant="outlined"
              onInput={(event) => {
                searchField(event.target.value);
              }}
            />
          </div>
        </form>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={list.length}
                />
                <TableBody>
                  {stableSort(list, getComparator(order, orderBy)).map(
                    (row, index) => {
                      return (
                        <TableRow tabIndex={-1} key={row.name}>
                          <TableCell />

                          <TableCell component="th" scope="row" padding="none">
                            <Link
                              href={`/item/${row.id}`}
                              className={classes.aLinkItem}
                            >
                              {row.name}
                            </Link>
                          </TableCell>

                          <TableCell align="left">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={
                              row.isActive
                                ? classes.checkActive
                                : classes.checkDisabled
                            }
                          >
                            {row.isActive ? "Active" : "Disable"}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </>
    );
  }
}
