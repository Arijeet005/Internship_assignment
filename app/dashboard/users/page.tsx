"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Card, CardContent, Typography, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Chip,
  Pagination, CircularProgress, Alert, Stack, InputAdornment,
  IconButton, Button, useMediaQuery, useTheme, Grid,
} from "@mui/material";
import {
  SearchOutlined, ClearOutlined, ArrowForwardOutlined,
  PersonOutlined, EmailOutlined, PhoneOutlined,
} from "@mui/icons-material";
import { useUsersStore } from "@/store/usersStore";
import { User } from "@/types";
import AuthGuard from "@/components/layout/AuthGuard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDebounce } from "@/lib/useDebounce";

const LIMIT = 10;

// Memoized user row to prevent unnecessary re-renders
const UserRow = memo(({ user, onClick }: { user: User; onClick: () => void }) => (
  <TableRow hover onClick={onClick} sx={{ cursor: "pointer" }}>
    <TableCell>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar src={user.image} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography fontWeight={600} fontSize={14}>{user.firstName} {user.lastName}</Typography>
          <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
        </Box>
      </Stack>
    </TableCell>
    <TableCell>
      <Typography fontSize={13} color="text.secondary">{user.email}</Typography>
    </TableCell>
    <TableCell>
      <Chip
        label={user.gender}
        size="small"
        color={user.gender === "male" ? "primary" : "secondary"}
        variant="outlined"
        sx={{ textTransform: "capitalize", fontWeight: 600 }}
      />
    </TableCell>
    <TableCell>
      <Typography fontSize={13}>{user.phone}</Typography>
    </TableCell>
    <TableCell>
      <Typography fontSize={13} noWrap>{user.company?.name}</Typography>
    </TableCell>
    <TableCell>
      <IconButton size="small" color="primary">
        <ArrowForwardOutlined fontSize="small" />
      </IconButton>
    </TableCell>
  </TableRow>
));
UserRow.displayName = "UserRow";

// Mobile card view
const UserCard = memo(({ user, onClick }: { user: User; onClick: () => void }) => (
  <Card onClick={onClick} sx={{ cursor: "pointer" }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={user.image} sx={{ width: 48, height: 48 }} />
        <Box flex={1} minWidth={0}>
          <Typography fontWeight={700}>{user.firstName} {user.lastName}</Typography>
          <Typography variant="caption" color="text.secondary" display="block">{user.email}</Typography>
          <Stack direction="row" spacing={1} mt={0.5}>
            <Chip label={user.gender} size="small" sx={{ textTransform: "capitalize", fontSize: 11 }} />
            <Chip label={user.company?.name} size="small" variant="outlined" sx={{ fontSize: 11, maxWidth: 140 }} />
          </Stack>
        </Box>
        <ArrowForwardOutlined color="action" />
      </Stack>
    </CardContent>
  </Card>
));
UserCard.displayName = "UserCard";

export default function UsersPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { users, total, loading, error, fetchUsers } = useUsersStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const totalPages = useMemo(() => Math.ceil(total / LIMIT), [total]);

  // Fetch when search or page changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers({
      limit: LIMIT,
      skip: (page - 1) * LIMIT,
      search: debouncedSearch,
    });
  }, [page, debouncedSearch, fetchUsers]);

  const handleUserClick = useCallback((id: number) => {
    router.push(`/dashboard/users/${id}`);
  }, [router]);

  const handleClearSearch = useCallback(() => setSearch(""), []);

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* Header */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} mb={3} spacing={1}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Users</Typography>
            <Typography variant="body2" color="text.secondary">
              {total > 0 ? `${total} total users` : "Loading users..."}
            </Typography>
          </Box>
        </Stack>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ py: "16px !important" }}>
            <TextField
              placeholder="Search users by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchOutlined color="action" /></InputAdornment>,
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearOutlined fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </CardContent>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Loading */}
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Desktop Table */}
        {!loading && !isMobile && (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} onClick={() => handleUserClick(user.id)} />
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* Mobile Cards */}
        {!loading && isMobile && (
          <Stack spacing={1.5}>
            {users.map((user) => (
              <UserCard key={user.id} user={user} onClick={() => handleUserClick(user.id)} />
            ))}
            {users.length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">No users found</Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
