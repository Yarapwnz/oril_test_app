import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


function createData(isActive, _id, name, id, date) {
    return { isActive, _id, name, id, date };
}

let rows = [
    createData("Disable", "60b8c59f81ada4e89cf6dfca", "Beer Coin", "beer_coin", "27.05.2021"),
    createData("Active", "60b8c59f81ada4e89cf6dfcb", "Cat Coin", "cat_coin", "15.01.2021"),
    createData("Active", "60b8c59f81ada4e89cf6dfcc", "Day Off Coin", "dayoff_coin", "12.05.2021"),
    createData("Disable", "60b8c59f81ada4e89cf6dfcd", "Katia Coin", "katia_coin", "05.02.2021"),
    createData("Active", "60b8c59f81ada4e89cf6dfce", "Oleh Coin", "oleh_coin", "29.04.2021"),
    createData("Active", "60b8c59f81ada4e89cf6dfcf", "Oril Coin", "oril_coin", "29.04.2021"),
    createData("Disable", "60b8c59f81ada4e89cf6dfd0", "Vacation Coin", "vacation_coin", "08.03.2021"),
];


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
    return order === 'desc'
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
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'isActive', numeric: true, disablePadding: false, label: 'State' },
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
        align={headCell.numeric ? 'right' : 'left'}
        padding={headCell.disablePadding ? 'none' : 'default'}
        sortDirection={orderBy === headCell.id ? order : false}
        >
        <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
        >
            {headCell.label}
            {orderBy === headCell.id ? (
            <span className={classes.visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
        width: '75%',
        '& .MuiTextField-root': {
          margin: theme.spacing(2),
          width: 300,
        },
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 550,
        position: 'flex',
        margin: 0,
    },
    visuallyHidden: {
        border: -1,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    checkActive: {
        color: "blue"
    },
    checkDisabled: {
        color: "red"
    },
    aLinkItem:{
      textDecoration: 'none underline',
      color: 'black',
    },
    }));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected] = React.useState([]);

const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
};


const [searchTerm, setSearchTerm] = useState('');
function searchField() {
  rows = rows.filter((row) => {
    return (row.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })
}
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
          borderRadius="50%!important"
          onChange={event => {setSearchTerm(event.target.value); searchField()} }
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
            rowCount={rows.length}
          />
        <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
            .map((row, index) => {
                return (
                <TableRow
                    tabIndex={-1}
                    key={row.name}
                >
                    <TableCell />

                    <TableCell component="th" scope="row" padding="none">
                    <a href="/item/+`{row.id}`" className={classes.aLinkItem}>{row.name}</a>
                    </TableCell>

                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="right" className={row.isActive==="Active" ? classes.checkActive : classes.checkDisabled}>{row.isActive}</TableCell>
                </TableRow>
                );
            })}
        </TableBody>
        </Table>
    </TableContainer>
    </Paper>
</div>
</>);
}
