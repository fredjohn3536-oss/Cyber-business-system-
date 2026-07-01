import { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MainCard from '../components/MainCard';

export default function Products() {
  const navigate = useNavigate();
  const { addProduct, categories, connected } = useContext(StoreContext);

  const [form, setForm] = useState({ name: '', cat: '', qty: '', buy: '', exp: '' });
  const [newCat, setNewCat] = useState(false);

  const catOptions = useMemo(() => {
    const names = categories.map(c => c.name);
    return [...new Set(names)].sort();
  }, [categories]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, cat, qty, buy, exp } = form;
    if (!name.trim()) return;
    const parsedQty = parseInt(qty);
    const parsedBuy = parseFloat(buy);
    const parsedExp = parseFloat(exp);
    if (isNaN(parsedQty) || parsedQty < 0) return;
    if (isNaN(parsedBuy) || parsedBuy < 0) return;
    if (isNaN(parsedExp) || parsedExp < 0) return;

    const success = addProduct({
      name: name.trim(), cat: cat.trim() || 'General',
      qty: parsedQty, buy: parsedBuy, exp: parsedExp
    });
    if (success) {
      setForm({ name: '', cat: '', qty: '', buy: '', exp: '' });
      setNewCat(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}><Typography variant="h5">Add New Product</Typography></Grid>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <MainCard>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField fullWidth label="Product Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. iPhone 15" autoComplete="off" />
              </Grid>
              <Grid size={12}>
                {connected && catOptions.length > 0 && !newCat ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid size="grow">
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select name="cat" value={form.cat} onChange={handleChange} label="Category">
                          <MenuItem value="">Select category...</MenuItem>
                          {catOptions.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid><Button variant="outlined" size="small" onClick={() => { setNewCat(true); setForm({ ...form, cat: '' }); }}>+ New</Button></Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={1} alignItems="center">
                    <Grid size="grow">
                      <TextField fullWidth label="Category" name="cat" value={form.cat} onChange={handleChange} placeholder="e.g. Electronics" autoFocus={newCat} />
                    </Grid>
                    {connected && catOptions.length > 0 && (
                      <Grid><Button variant="outlined" size="small" onClick={() => setNewCat(false)}>Pick</Button></Grid>
                    )}
                  </Grid>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth type="number" label="Quantity" name="qty" value={form.qty} onChange={handleChange} placeholder="0" slotProps={{ htmlInput: { min: 0 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth type="number" label="Buying Price (TSh)" name="buy" value={form.buy} onChange={handleChange} placeholder="0.00" slotProps={{ htmlInput: { step: 0.01, min: 0 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth type="number" label="Selling Price (TSh)" name="exp" value={form.exp} onChange={handleChange} placeholder="0.00" slotProps={{ htmlInput: { step: 0.01, min: 0 } }} />
              </Grid>
              <Grid size={12}>
                <Button type="submit" variant="contained" fullWidth size="large">Add Product</Button>
              </Grid>
            </Grid>
          </form>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Products added here will immediately appear in the Sales page categorized by their category.
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
