"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Card, CardContent, Typography, Chip, Button, Grid,
  Rating, Divider, Stack, CircularProgress, Alert, Avatar,
  IconButton, LinearProgress,
} from "@mui/material";
import {
  ArrowBackOutlined, ChevronLeftOutlined, ChevronRightOutlined,
  LocalShippingOutlined, VerifiedOutlined, StarOutlined,
} from "@mui/icons-material";
import { useProductsStore } from "@/store/productsStore";
import AuthGuard from "@/components/layout/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentProduct, loading, error, fetchProductById, clearCurrentProduct } = useProductsStore();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProductById(Number(id));
    return () => clearCurrentProduct();
  }, [id, fetchProductById, clearCurrentProduct]);

  const handlePrevImage = useCallback(() => {
    setActiveImage((prev) => (prev === 0 ? (currentProduct?.images.length ?? 1) - 1 : prev - 1));
  }, [currentProduct?.images.length]);

  const handleNextImage = useCallback(() => {
    setActiveImage((prev) => (prev + 1) % (currentProduct?.images.length ?? 1));
  }, [currentProduct?.images.length]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push("/dashboard/products")} sx={{ mb: 3 }}>
          Back to Products
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && currentProduct && (
          <Grid container spacing={4}>
            {/* Image Carousel */}
            <Grid item xs={12} md={5}>
              <Card>
                <Box sx={{ position: "relative", bgcolor: "#F9FAFB" }}>
                  <Box
                    component="img"
                    src={currentProduct.images[activeImage] || currentProduct.thumbnail}
                    alt={currentProduct.title}
                    sx={{ width: "100%", height: 360, objectFit: "contain", p: 2 }}
                  />
                  {currentProduct.images.length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "white", boxShadow: 2 }}
                      >
                        <ChevronLeftOutlined />
                      </IconButton>
                      <IconButton
                        onClick={handleNextImage}
                        sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "white", boxShadow: 2 }}
                      >
                        <ChevronRightOutlined />
                      </IconButton>
                    </>
                  )}
                </Box>
                {/* Thumbnails */}
                {currentProduct.images.length > 1 && (
                  <Box sx={{ p: 2, display: "flex", gap: 1, overflowX: "auto" }}>
                    {currentProduct.images.map((img, i) => (
                      <Box
                        key={i}
                        component="img"
                        src={img}
                        onClick={() => setActiveImage(i)}
                        sx={{
                          width: 56, height: 56, objectFit: "cover", borderRadius: 2,
                          border: i === activeImage ? "2px solid" : "2px solid transparent",
                          borderColor: i === activeImage ? "primary.main" : "transparent",
                          cursor: "pointer", flexShrink: 0, bgcolor: "#F0F4FF",
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Card>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Box>
                  <Chip
                    label={currentProduct.category.replace(/-/g, " ")}
                    sx={{ textTransform: "capitalize", bgcolor: "#EEF2FF", color: "#1A56DB", fontWeight: 600, mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={800} mb={1}>{currentProduct.title}</Typography>
                  {currentProduct.brand && (
                    <Typography variant="body2" color="text.secondary">by {currentProduct.brand}</Typography>
                  )}
                </Box>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={currentProduct.rating} precision={0.1} readOnly />
                  <Typography fontWeight={600}>{currentProduct.rating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({currentProduct.reviews?.length || 0} reviews)
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="baseline" spacing={1.5}>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    ${currentProduct.price}
                  </Typography>
                  {currentProduct.discountPercentage > 0 && (
                    <>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ${(currentProduct.price / (1 - currentProduct.discountPercentage / 100)).toFixed(2)}
                      </Typography>
                      <Chip
                        label={`${Math.round(currentProduct.discountPercentage)}% OFF`}
                        size="small"
                        sx={{ bgcolor: "#ECFDF5", color: "#0E9F6E", fontWeight: 700 }}
                      />
                    </>
                  )}
                </Stack>

                <Typography color="text.secondary" lineHeight={1.7}>
                  {currentProduct.description}
                </Typography>

                <Divider />

                {/* Specs */}
                <Grid container spacing={1.5}>
                  {[
                    ["Stock", `${currentProduct.stock} units`],
                    ["Min. Order", `${currentProduct.minimumOrderQuantity} unit(s)`],
                    ["Weight", `${currentProduct.weight}g`],
                    ["Status", currentProduct.availabilityStatus],
                    ["Warranty", currentProduct.warrantyInformation],
                    ["Return Policy", currentProduct.returnPolicy],
                  ].map(([label, value]) => (
                    <Grid item xs={6} key={label}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase" letterSpacing="0.05em">
                          {label}
                        </Typography>
                        <Typography fontWeight={500} fontSize={13} mt={0.2}>{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider />

                {/* Shipping */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: "#F0F4FF", p: 2, borderRadius: 2 }}>
                  <LocalShippingOutlined color="primary" />
                  <Typography variant="body2" fontWeight={500}>{currentProduct.shippingInformation}</Typography>
                </Stack>

                {/* Tags */}
                {currentProduct.tags?.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {currentProduct.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* Reviews */}
            {currentProduct.reviews?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700} mb={2}>Customer Reviews</Typography>
                <Grid container spacing={2}>
                  {currentProduct.reviews.map((review, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 13 }}>
                              {review.reviewerName[0]}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} fontSize={13}>{review.reviewerName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" mt={1} fontSize={13}>
                            {review.comment}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
