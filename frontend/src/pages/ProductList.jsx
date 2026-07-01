import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { productsAPI, categoriesAPI } from '../services/api';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import MainCard from '../components/MainCard';

export default function ProductList() {
  const { products, setProducts } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await categoriesAPI.list();
        setCategories(res.data);
      } catch { /* offline */ }
    })();
  }, []);

  const handleDelete = async (productIndex) => {
    const p = products[productIndex];
    try { await productsAPI.delete(p.id); } catch { /* offline */ }
    setProducts(products.filter((_, i) => i !== productIndex));
  };

  const startEdit = (product, index) => {
    setEditingId(index);
    setEditForm({
      product_name: product.name, cat: product.cat || 'General',
      qty: product.qty, buy: product.buy, exp: product.exp
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (index) => {
    const p = products[index];
    try {
      await productsAPI.update(p.id, {
        product_name: editForm.product_name, selling_price: parseFloat(editForm.exp),
        buying_price: parseFloat(editForm.buy), stock_quantity: parseInt(editForm.qty)
      });
    } catch { /* offline */ }
    const updated = [...products];
    updated[index] = { ...p, name: editForm.product_name, cat: editForm.cat, qty: parseInt(editForm.qty), buy: parseFloat(editForm.buy), exp: parseFloat(editForm.exp) };
    setProducts(updated);
    setEditingId(null);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="h5">Inventory</Typography></Grid>
          <Grid>
            <TextField size="small" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 250 }} />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        {filtered.length === 0 ? (
          <MainCard>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {search ? `No products matching "${search}"` : 'No products yet. Add some from the Products page!'}
            </Typography>
          </MainCard>
        ) : (
          filtered.map((product, idx) => {
            const realIdx = products.indexOf(product);
            const isEditing = editingId === realIdx;

            return (
              <MainCard key={product.name + product.createdAt} sx={{ mb: 1.5 }}>
                {isEditing ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField fullWidth size="small" label="Name" value={editForm.product_name} onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField fullWidth size="small" label="Category" value={editForm.cat} onChange={(e) => setEditForm({ ...editForm, cat: e.target.value })} />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                      <TextField fullWidth size="small" type="number" label="Qty" value={editForm.qty} onChange={(e) => setEditForm({ ...editForm, qty: e.target.value })} />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                      <TextField fullWidth size="small" type="number" label="Buy (TSh)" value={editForm.buy} onChange={(e) => setEditForm({ ...editForm, buy: e.target.value })} slotProps={{ htmlInput: { step: 0.01 } }} />
                    </Grid>
                    <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                      <TextField fullWidth size="small" type="number" label="Sell (TSh)" value={editForm.exp} onChange={(e) => setEditForm({ ...editForm, exp: e.target.value })} slotProps={{ htmlInput: { step: 0.01 } }} />
                    </Grid>
                    <Grid size="auto" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button variant="contained" color="success" size="small" startIcon={<SaveOutlined />} onClick={() => saveEdit(realIdx)}>Save</Button>
                      <Button variant="outlined" size="small" startIcon={<CloseOutlined />} onClick={cancelEdit}>Cancel</Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container alignItems="center" spacing={2}>
                    <Grid size="grow">
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1">{product.name}</Typography>
                        <Chip label={product.cat || 'General'} size="small" variant="outlined" />
                      </Stack>
                      <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="text.secondary">Stock: <b>{product.qty}</b></Typography>
                        <Typography variant="body2" color="text.secondary">Cost: TSh {product.buy?.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary">Sell: TSh {product.exp?.toFixed(2)}</Typography>
                        <Typography variant="body2" color="text.secondary">Margin: TSh {((product.exp || 0) - (product.buy || 0)).toFixed(2)}</Typography>
                      </Stack>
                      {product.qty <= 3 && <Chip label="Low stock" color="error" size="small" sx={{ mt: 0.5 }} />}
                    </Grid>
                    <Grid>
                      <IconButton size="small" onClick={() => startEdit(product, realIdx)}><EditOutlined /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(realIdx)}><DeleteOutlined /></IconButton>
                    </Grid>
                  </Grid>
                )}
              </MainCard>
            );
          })
        )}
      </Grid>
    </Grid>
  );
}
