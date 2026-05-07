"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Card, CardContent, CardMedia, CardActions, Typography,
  TextField, Grid, Chip, Pagination, CircularProgress, Alert,
  Stack, InputAdornment, IconButton, Select, MenuItem,
  FormControl, InputLabel, Rating, Button,
} from "@mui/material";
import {
  SearchOutlined, ClearOutlined, FilterListOutlined,
} from "@mui/icons-material";
import { useProductsStore } from "@/store/productsStore";
import { Product } from "@/types";
import AuthGuard from "@/components/layout/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDebounce } from "@/lib/useDebounce";

const LIMIT = 12;

// Memoized product card to avoid unnecessary re-renders
const ProductCard = memo(({ product, onClick }: { product: Product; onClick: () => void }) => (
  <Card
    sx={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
    onClick={onClick}
  >
    <CardMedia
      component="img"
      height={180}
      image={product.thumbnail}
      alt={product.title}
      sx={{ objectFit: "cover" }}
    />
    <CardContent sx={{ flex: 1, pb: 1 }}>
      <Chip
        label={product.category}
        size="small"
        sx={{
          mb: 1, fontSize: 10, textTransform: "capitalize",
          bgcolor: "#EEF2FF", color: "#1A56DB", fontWeight: 600,
        }}
      />
      <Typography fontWeight={700} fontSize={14} mb={0.5} sx={{
        overflow: "hidden", textOverflow: "ellipsis",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>
        {product.title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
        <Rating value={product.rating} precision={0.1} size="small" readOnly />
        <Typography variant="caption" color="text.secondary">({product.rating})</Typography>
      </Stack>
    </CardContent>
    <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
      <Typography fontWeight={800} color="primary.main" fontSize={18}>
        ${product.price}
      </Typography>
      {product.discountPercentage > 0 && (
        <Chip
          label={`-${Math.round(product.discountPercentage)}%`}
          size="small"
          sx={{ ml: 1, bgcolor: "#ECFDF5", color: "#0E9F6E", fontWeight: 700, fontSize: 11 }}
        />
      )}
    </CardActions>
  </Card>
));
ProductCard.displayName = "ProductCard";

export default function ProductsPage() {
  const router = useRouter();
  const { products, total, categories, loading, error, fetchProducts, fetchCategories } = useProductsStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const totalPages = useMemo(() => Math.ceil(total / LIMIT), [total]);

  // Load categories on mount
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, category]);

  useEffect(() => {
    fetchProducts({
      limit: LIMIT,
      skip: (page - 1) * LIMIT,
      search: debouncedSearch,
      category,
    });
  }, [page, debouncedSearch, category, fetchProducts]);

  const handleProductClick = useCallback((id: number) => {
    router.push(`/dashboard/products/${id}`);
  }, [router]);

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Header */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} mb={3} spacing={1}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Products</Typography>
            <Typography variant="body2" color="text.secondary">
              {total > 0 ? `${total} products found` : "Loading..."}
            </Typography>
          </Box>
        </Stack>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ py: "16px !important" }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchOutlined color="action" /></InputAdornment>,
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch("")}>
                        <ClearOutlined fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  startAdornment={<FilterListOutlined fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />}
                >
                  <MenuItem value=""><em>All Categories</em></MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat} sx={{ textTransform: "capitalize" }}>
                      {cat.replace(/-/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <>
            <Grid container spacing={2.5}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} onClick={() => handleProductClick(product.id)} />
                </Grid>
              ))}
              {products.length === 0 && (
                <Grid item xs={12}>
                  <Box textAlign="center" py={6}>
                    <Typography color="text.secondary" variant="h6">No products found</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearch(""); setCategory(""); }}>
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
