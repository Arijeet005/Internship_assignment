"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Card, CardContent, Typography, Avatar, Grid, Chip,
  Button, Divider, Stack, CircularProgress, Alert,
} from "@mui/material";
import {
  ArrowBackOutlined, EmailOutlined, PhoneOutlined, LocationOnOutlined,
  BusinessOutlined, CakeOutlined, SchoolOutlined,
} from "@mui/icons-material";
import { useUsersStore } from "@/store/usersStore";
import AuthGuard from "@/components/layout/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box sx={{ color: "primary.main", mt: 0.3 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
          {label}
        </Typography>
        <Typography fontWeight={500} mt={0.2}>{value || "—"}</Typography>
      </Box>
    </Stack>
  );
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, loading, error, fetchUserById, clearCurrentUser } = useUsersStore();

  useEffect(() => {
    fetchUserById(Number(id));
    return () => clearCurrentUser();
  }, [id, fetchUserById, clearCurrentUser]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => router.push("/dashboard/users")}
          sx={{ mb: 3 }}
        >
          Back to Users
        </Button>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!loading && currentUser && (
          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Avatar
                    src={currentUser.image}
                    sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    {currentUser.firstName} {currentUser.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    @{currentUser.username}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                    <Chip
                      label={currentUser.gender}
                      size="small"
                      color={currentUser.gender === "male" ? "primary" : "secondary"}
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Chip label={`Age ${currentUser.age}`} size="small" variant="outlined" />
                    <Chip
                      label={currentUser.bloodGroup}
                      size="small"
                      sx={{ bgcolor: "#FEF2F2", color: "#E02424", fontWeight: 600 }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Details */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                {/* Contact */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>Contact Information</Typography>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                          <InfoItem icon={<EmailOutlined fontSize="small" />} label="Email" value={currentUser.email} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoItem icon={<PhoneOutlined fontSize="small" />} label="Phone" value={currentUser.phone} />
                        </Grid>
                        <Grid item xs={12}>
                          <InfoItem
                            icon={<LocationOnOutlined fontSize="small" />}
                            label="Address"
                            value={`${currentUser.address?.address}, ${currentUser.address?.city}, ${currentUser.address?.state}, ${currentUser.address?.country} ${currentUser.address?.postalCode}`}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Company */}
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>Company</Typography>
                      <Stack spacing={2}>
                        <InfoItem icon={<BusinessOutlined fontSize="small" />} label="Company" value={currentUser.company?.name} />
                        <InfoItem icon={<BusinessOutlined fontSize="small" />} label="Department" value={currentUser.company?.department} />
                        <InfoItem icon={<BusinessOutlined fontSize="small" />} label="Title" value={currentUser.company?.title} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Personal */}
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} mb={2}>Personal Details</Typography>
                      <Stack spacing={2}>
                        <InfoItem icon={<CakeOutlined fontSize="small" />} label="Birth Date" value={currentUser.birthDate} />
                        <InfoItem icon={<SchoolOutlined fontSize="small" />} label="University" value={currentUser.university} />
                        <InfoItem
                          icon={<></>}
                          label="Physical"
                          value={`${currentUser.height}cm · ${currentUser.weight}kg · ${currentUser.eyeColor} eyes · ${currentUser.hair?.color} ${currentUser.hair?.type} hair`}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
