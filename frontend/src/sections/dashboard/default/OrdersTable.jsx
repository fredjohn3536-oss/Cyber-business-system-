import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function OrdersTable({ orders }) {
  return (
    <TableContainer sx={{ width: '100%', overflowX: 'auto', display: 'block', maxWidth: '100%', '& td, & th': { whiteSpace: 'nowrap' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Profit</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No orders yet</TableCell></TableRow>
          ) : orders.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell><Link color="secondary" underline="hover">{row.receipt_number}</Link></TableCell>
              <TableCell>{row.items_count} items</TableCell>
              <TableCell align="right">TSh {parseFloat(row.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
              <TableCell align="right" sx={{ color: row.total_profit >= 0 ? 'success.main' : 'error.main' }}>
                TSh {parseFloat(row.total_profit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>{new Date(row.sale_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
