"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Avatar, Stack, LinearProgress, Chip,
} from "@mui/material";
import {
  PeopleOutlined, ShoppingBagOutlined, TrendingUpOutlined,
  ArrowForwardOutlined,
} from "@mui/icons-material";
import AuthGuard from "@/components/layout/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";

const statCards = [
  {
    label: "Total Users",
    value: "208",
    icon: <PeopleOutlined />,
    color: "#1A56DB",
    bg: "#EEF2FF",
    change: "+12%",
    path: "/dashboard/users",
  },
  {
    label: "Total Products",
    value: "194",
    icon: <ShoppingBagOutlined />,
    color: "#7E3AF2",
    bg: "#F5F3FF",
    change: "+8%",
    path: "/dashboard/products",
  },
  {
    label: "Active Sessions",
    value: "34",
    icon: <TrendingUpOutlined />,
    color: "#0E9F6E",
    bg: "#ECFDF5",
    change: "+3%",
    path: "#",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { user } = useAuthStore();
  const router = useRouter();
  const displayUser = (user as any) || session?.user;

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Header */}
        <Box mb={4}>
          <Stack direction="row" alignItems="center" spacing={2} mb={0.5}>
            <Avatar
              src={(displayUser as any)?.image || ""}
              sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
            >
              {displayUser?.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Welcome back, {displayUser?.name?.split(" ")[0] || "Admin"} 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Here's what's happening in your dashboard today.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((card) => (
            <Grid item xs={12} sm={4} key={card.label}>
              <Card
                sx={{ cursor: card.path !== "#" ? "pointer" : "default" }}
                onClick={() => card.path !== "#" && router.push(card.path)}
              >
                <CardContent>
                  <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
                        {card.label}
                      </Typography>
                      <Typography variant="h3" fontWeight={800} color="text.primary">
                        {card.value}
                      </Typography>
                      <Chip
                        label={card.change}
                        size="small"
                        sx={{
                          mt: 1, bgcolor: card.bg, color: card.color,
                          fontWeight: 600, fontSize: 11,
                        }}
                      />
                    </Box>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: 2,
                      bgcolor: card.bg, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      color: card.color,
                    }}>
                      {card.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Quick Actions</Typography>
                <Stack spacing={1.5}>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForwardOutlined />}
                    onClick={() => router.push("/dashboard/users")}
                    sx={{ justifyContent: "space-between" }}
                  >
                    Browse All Users
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForwardOutlined />}
                    onClick={() => router.push("/dashboard/products")}
                    sx={{ justifyContent: "space-between" }}
                  >
                    Browse All Products
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Your Session</Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Logged in as</Typography>
                    <Typography variant="body2" fontWeight={600}>{displayUser?.name}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{displayUser?.email}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Token</Typography>
                    <Chip label="Active" size="small" color="success" sx={{ fontWeight: 600 }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DashboardLayout>
    </AuthGuard>
  );
}
