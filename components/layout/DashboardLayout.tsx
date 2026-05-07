"use client";
import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar, IconButton,
  Divider, Chip, Stack, Tooltip, useMediaQuery, useTheme,
  CircularProgress,
} from "@mui/material";
import {
  DashboardOutlined, PeopleOutlined, ShoppingBagOutlined,
  MenuOutlined, LogoutOutlined, SchoolOutlined, ChevronLeft,
} from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";

const DRAWER_WIDTH = 256;

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardOutlined />, path: "/dashboard" },
  { label: "Users", icon: <PeopleOutlined />, path: "/dashboard/users" },
  { label: "Products", icon: <ShoppingBagOutlined />, path: "/dashboard/products" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const { user, clearUser } = useAuthStore();

  const handleLogout = useCallback(async () => {
    clearUser();
    await signOut({ redirect: false });
    router.push("/login");
  }, [clearUser, router]);

  const displayUser = (user as any) || session?.user;

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Brand */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: "linear-gradient(135deg, #1A56DB, #7E3AF2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <SchoolOutlined sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize={14} lineHeight={1.2}>Help Study</Typography>
          <Typography fontWeight={700} fontSize={14} lineHeight={1.2} color="primary.main">Abroad</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { router.push(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "primary.main" : "transparent",
                  color: active ? "white" : "text.secondary",
                  "&:hover": {
                    bgcolor: active ? "primary.dark" : "action.hover",
                  },
                  "& .MuiListItemIcon-root": { color: active ? "white" : "text.secondary", minWidth: 36 },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: 14 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Profile */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={(displayUser as any)?.image || ""}
            sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: 14 }}
          >
            {displayUser?.name?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Typography fontWeight={600} fontSize={13} noWrap>{displayUser?.name || "Admin"}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{displayUser?.email || ""}</Typography>
          </Box>
          <Tooltip title="Sign out">
            <IconButton size="small" onClick={handleLogout} color="inherit">
              <LogoutOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                borderRight: "1px solid",
                borderColor: "divider",
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile AppBar */}
        {isMobile && (
          <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Toolbar>
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 1 }}>
                <MenuOutlined />
              </IconButton>
              <Typography fontWeight={700} flex={1}>Help Study Abroad</Typography>
              <Avatar src={(displayUser as any)?.image || ""} sx={{ width: 32, height: 32 }}>
                {displayUser?.name?.[0] || "A"}
              </Avatar>
            </Toolbar>
          </AppBar>
        )}

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
