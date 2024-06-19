import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import { FormLabel, TextField } from '@mui/material';

export interface Guest {
   id: number;
   name: string;
   lastname: string;
   role: number;
   bus?: boolean;
   prewedding?: boolean;
   joined_at: string;
   group?: string;
   plusOne: string;
   infoMenu: string;
   suggestion: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
   if (b[orderBy] < a[orderBy]) {
      return -1;
   }
   if (b[orderBy] > a[orderBy]) {
      return 1;
   }
   return 0;
}

type Order = 'asc' | 'desc';

function getComparator(order: Order, orderBy: keyof Guest): (a: Guest, b: Guest) => number {
   return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
   disablePadding: boolean;
   id: keyof Guest;
   label: string;
   align: "center" | "left" | "right" | "inherit" | "justify" | undefined;
   hidden: boolean;
   sortable: boolean;
}

const headCells: HeadCell[] = [
   {
      id: 'name',
      align: 'left',
      disablePadding: true,
      label: 'Seleccionar todo',
      hidden: false,
      sortable: false,
   },
   {
      id: 'plusOne',
      align: 'center',
      disablePadding: true,
      label: '',
      hidden: false,
      sortable: false,
   },
   {
      id: 'role',
      align: 'center',
      disablePadding: false,
      label: 'Confirmado',
      hidden: false,
      sortable: true,
   },
   {
      id: 'bus',
      align: 'center',
      disablePadding: false,
      label: 'Bus',
      hidden: true,
      sortable: true,
   },
   {
      id: 'prewedding',
      align: 'center',
      disablePadding: false,
      label: 'Preboda',
      hidden: true,
      sortable: true,
   },
   {
      id: 'joined_at',
      align: 'center',
      disablePadding: false,
      label: 'Se unió a la boda el...',
      hidden: false,
      sortable: true,
   },
];

interface ListProps {
   numSelected: number;
   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Guest) => void;
   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
   order: Order;
   orderBy: string;
   rowCount: number;
}

function ListHead(props: ListProps) {
   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
   const createSortHandler =
      (property: keyof Guest) => (event: React.MouseEvent<unknown>) => {
         onRequestSort(event, property);
      };

   return (
      <TableHead>
         <TableRow>
            <TableCell padding="checkbox">
               <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
               />
            </TableCell>
            {headCells.map((headCell) => (
               <TableCell
                  hidden={headCell.hidden}
                  key={headCell.id}
                  align={headCell.align}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
               >
                  {headCell.sortable ?
                     <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                     >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                           <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                           </Box>
                        ) : null}
                     </TableSortLabel>
                     : headCell.label}
               </TableCell>
            ))}
         </TableRow>
      </TableHead>
   );
}


function ListToolbar(props: {
   numSelected: number;
   selected: number[];
   handleCancelInvite: (ids: number[]) => void;
   showFilter: boolean;
   setShowFilter: (a: boolean) => void,
   setFilter: (a: string) => void
   setFilterGroup: (a: string) => void
}) {

   const handleToggleShowFilter = () => {
      if (props.showFilter) props.setFilter('')
      if (props.showFilter) props.setFilterGroup('')
      props.setShowFilter(!props.showFilter)
   }

   return (
      <Toolbar
         sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
         }}
         className='d-flex justify-content-between'
      >
         <div className='d-flex align-items-center'>
            <Typography
               variant="h6"
               id="tableTitle"
               component="div"
            >
               Invitados
            </Typography>
            {props.numSelected > 0 &&
               <Typography
                  className='ms-5'
                  color="inherit"
                  variant="subtitle2"
                  component="div"
               >
                  {props.numSelected} seleccionados
               </Typography>
            }
         </div>
         <div className='d-flex align-items-center pe-3 gap-4'>
            <div>Acciones</div>
            {props.numSelected > 0 &&
               <Tooltip
                  title="Cancelar invitación"
               >
                  <div onClick={() => props.handleCancelInvite(props.selected)}>
                     <IconButton>
                        <CancelScheduleSendIcon />
                     </IconButton>
                  </div>
               </Tooltip>
            }
            <Tooltip
               title="Filtrar lista"
            >
               <div onClick={handleToggleShowFilter}>
                  <IconButton>
                     <FilterListIcon />
                  </IconButton>
               </div>
            </Tooltip>
         </div>
      </Toolbar >
   );
}

export default function List(props: {
   guests: Guest[],
   groups: string[],
   setGuest: (guest: Guest) => void,
   bus: boolean,
   prewedding: boolean,
   handleCancelInvite: (ids: number[]) => void
}) {
   const [order, setOrder] = useState<Order>('asc');
   const [orderBy, setOrderBy] = useState<keyof Guest>('joined_at');
   const [selected, setSelected] = useState<number[]>([]);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [showFilter, setShowFilter] = useState(false);
   const [filter, setFilter] = useState('');
   const [filterGroup, setFilterGroup] = useState('');
   const [guests, setGuests] = useState<Guest[]>([]);

   useEffect(() => {
      headCells[3].hidden = !props.bus
      headCells[4].hidden = !props.prewedding
   }, [props.bus, props.prewedding])

   useEffect(() => {
      setGuests(props.guests.map(g => ({ ...g, active: false })))
   }, [props.guests])

   const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof Guest) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
         const newSelected = guests.map((n) => n.id);
         setSelected(newSelected);
         return;
      }
      setSelected([]);
   };

   const handleSelect = (event: React.MouseEvent<unknown>, id: number) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected: number[] = [];

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
         );
      }
      setSelected(newSelected);
   };

   const handleClick = (guest: Guest) => {
      props.setGuest(guest)
   }

   const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const isSelected = (id: number) => selected.indexOf(id) !== -1;

   // Avoid a layout jump when reaching the last page with empty rows.
   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.guests.length) : 0;

   const visibleRows = useMemo(() =>
      guests.slice()
         .sort(getComparator(order, orderBy))
         .filter((r) => {
            return r.name.toLowerCase().startsWith(filter.toLowerCase())
               || r.lastname.toLowerCase().startsWith(filter.toLowerCase())
               && r.group === filterGroup
         })
         .slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
         ), [order, orderBy, page, rowsPerPage, guests, filter, filterGroup]);

   return (
      <Box sx={{ width: '100%' }}>
         <Paper sx={{ width: '100%', mb: 2 }}>
            <ListToolbar
               numSelected={selected.length}
               selected={selected}
               handleCancelInvite={props.handleCancelInvite}
               showFilter={showFilter}
               setShowFilter={setShowFilter}
               setFilter={setFilter}
               setFilterGroup={setFilterGroup}
            />
            {showFilter &&
               <div className='d-flex justify-content-end gap-4'>
                  <FormLabel className='d-flex align-items-end'>FILTROS:</FormLabel>
                  {/* <FormControl sx={{ minWidth: 120, display: 'flex', flexDirection: 'row', gap: 3 }} variant='standard' size="small">
                     <Select
                        value={filterGroup || 'Todos los grupos'}
                        onChange={(e) => {
                           const group = e.target.value === 'Todos los grupos' ? '' : e.target.value;
                           setFilterGroup(group)
                        }}
                     >
                        <MenuItem value='Todos los grupos'>Todos los grupos</MenuItem>
                        {props.groups.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                     </Select>
                  </FormControl> */}
                  <TextField
                     sx={{ width: '150px' }}
                     id="filter-guests"
                     label="Nombre ó apellidos"
                     variant="standard"
                     onChange={(e) => setFilter(e.target.value)}
                  />
               </div>
            }
            <TableContainer>
               <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={'medium'}
               >
                  <ListHead
                     numSelected={selected.length}
                     order={order}
                     orderBy={orderBy}
                     onSelectAllClick={handleSelectAllClick}
                     onRequestSort={handleRequestSort}
                     rowCount={guests.length}
                  />
                  <TableBody>
                     {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                           <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleClick(row)}
                           >
                              <TableCell padding="checkbox">
                                 <Checkbox
                                    onClick={(event) => {
                                       event.stopPropagation()
                                       handleSelect(event, row.id)
                                    }}
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                       'aria-labelledby': labelId,
                                    }}
                                 />
                              </TableCell>
                              <TableCell
                                 component="th"
                                 id={labelId}
                                 scope="row"
                                 padding="none"
                              >
                                 {row.name + " " + row.lastname}
                              </TableCell>
                              <TableCell align="center">{row.plusOne !== null ? '+1' : ''}</TableCell>
                              <TableCell align="center">{row.role === 3 ? <DoneIcon className='text-success' />
                                 : (row.role === 2 ? <HorizontalRuleIcon /> : <ClearIcon className='text-danger' />)
                              }</TableCell>
                              {props.prewedding &&
                                 <TableCell align="center">{row.role === 2 ? <HorizontalRuleIcon /> : (row.prewedding && row.role !== 4 ? <DoneIcon /> : <ClearIcon />)}</TableCell>
                              }{props.bus &&
                                 <TableCell align="center">{row.role === 2 ? <HorizontalRuleIcon /> : (row.bus && row.role !== 4 ? <DoneIcon /> : <ClearIcon />)}</TableCell>
                              }
                              <TableCell align="center">{row.joined_at}</TableCell>
                           </TableRow>
                        );
                     })}
                     {emptyRows > 0 && (
                        <TableRow
                           style={{
                              height: (53) * emptyRows,
                           }}
                        >
                           <TableCell colSpan={6} />
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
            <TablePagination
               labelDisplayedRows={
                  ({ from, to, count }) => {
                     return '' + from + '-' + to + ' de ' + count
                  }
               }
               labelRowsPerPage={'Número de filas:'}
               rowsPerPageOptions={[5, 10, 25]}
               component="div"
               count={guests.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage}
            />
         </Paper>
      </Box>
   );
}