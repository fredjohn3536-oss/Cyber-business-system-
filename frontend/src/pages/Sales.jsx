import { useState, useContext, useMemo } from 'react';
import { StoreContext } from '../context/StoreContext';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MainCard from '../components/MainCard';

export default function Sales() {
  const theme = useTheme();
  const { products, processSale } = useContext(StoreContext);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [sellForms, setSellForms] = useState({});

  const categories = useMemo(() => {
    const cats = products.map(p => p.cat && p.cat.trim() !== '' ? p.cat.trim() : 'General');
    return ['All', ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (currentCategory !== 'All') {
      result = result.filter(p => (p.cat && p.cat.trim() === currentCategory) || (currentCategory === 'General' && (!p.cat || p.cat.trim() === '')));
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [products, currentCategory, searchQuery]);

  const handleFormChange = (productName, field, value) => {
    setSellForms(prev => ({ ...prev, [productName]: { ...prev[productName], [field]: value } }));
  };

  const handleSell = (product) => {
    const form = sellForms[product.name] || {};
    const qty = parseInt(form.qty);
    const price = parseFloat(form.price);
    if (isNaN(qty) || qty <= 0) return;
    if (isNaN(price) || price < 0) return;
    if (product.qty < qty) return;

    const saleRecord = processSale(product.name, qty, price);
    if (saleRecord) {
      setReceipt(saleRecord);
      handleFormChange(product.name, 'qty', '');
      handleFormChange(product.name, 'price', '');
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}><Typography variant="h5">Point of Sale</Typography></Grid>

      <Grid size={12}>
        <Stack direction="row" sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ minWidth: 280 }} />
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Chip key={cat} label={cat} onClick={() => setCurrentCategory(cat)} color={currentCategory === cat ? 'primary' : 'default'} variant={currentCategory === cat ? 'filled' : 'outlined'} size="small" />
            ))}
          </Stack>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        {filteredProducts.length === 0 ? (
          <MainCard>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              {searchQuery ? `No products found matching "${searchQuery}"` : `No products in "${currentCategory}" category.`}
            </Typography>
          </MainCard>
        ) : (
          filteredProducts.map(product => (
            <MainCard key={product.name} sx={{ mb: 1.5 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size="grow">
                  <Typography variant="subtitle1" color={theme.palette.mode === 'dark' ? 'warning.light' : 'warning.dark'}>{product.name}</Typography>
                  <Stack direction="row" sx={{ gap: 2, mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">Stock: <b>{product.qty}</b></Typography>
                    <Typography variant="body2" color="text.secondary">Cost: TSh {product.buy?.toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">Price: TSh {product.exp?.toFixed(2)}</Typography>
                  </Stack>
                  <Box sx={{ mt: 0.5 }}>
                    {product.qty <= 3
                      ? <Chip label="Low stock" color="error" size="small" />
                      : <Chip label="In Stock" color="success" size="small" variant="outlined" />
                    }
                  </Box>
                </Grid>
                <Grid>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <TextField size="small" type="number" placeholder="Qty" sx={{ width: 80 }}
                      slotProps={{ htmlInput: { min: 1, max: product.qty } }}
                      value={sellForms[product.name]?.qty || ''}
                      onChange={(e) => handleFormChange(product.name, 'qty', e.target.value)} />
                    <TextField size="small" type="number" placeholder="Price" sx={{ width: 100 }}
                      slotProps={{ htmlInput: { step: 0.01 } }}
                      value={sellForms[product.name]?.price || ''}
                      onChange={(e) => handleFormChange(product.name, 'price', e.target.value)} />
                    <Button variant="contained" color="success" size="small" onClick={() => handleSell(product)}>Sell</Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          ))
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        {receipt && (
          <MainCard>
            <Typography variant="subtitle1" color="success.main" sx={{ mb: 2 }}>Transaction Receipt</Typography>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="body2"><b>Item:</b> {receipt.name}</Typography>
              <Typography variant="body2"><b>Quantity:</b> {receipt.qty}</Typography>
              <Typography variant="body2"><b>Unit Price:</b> TSh {receipt.price.toFixed(2)}</Typography>
              <Typography variant="body2"><b>Total Income:</b> TSh {receipt.income.toFixed(2)}</Typography>
              <Typography variant="body2" color="success.main"><b>Profit:</b> TSh {receipt.profit.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">{new Date(receipt.timestamp).toLocaleString()}</Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label="Completed" color="success" size="small" />
              </Box>
            </Stack>
          </MainCard>
        )}
      </Grid>
    </Grid>
  );
}
