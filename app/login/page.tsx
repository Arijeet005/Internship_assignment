"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, InputAdornment,
  IconButton, Stack, Chip,
} from "@mui/material";
import { Visibility, VisibilityOff, SchoolOutlined, LockOutlined, PersonOutline } from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setUser } = useAuthStore();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Also store in Zustand (backup for token)
    try {
      const rawRes = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      });
      if (rawRes.ok) {
        const userData = await rawRes.json();
        setUser(
          {
            id: userData.id, username: userData.username,
            email: userData.email, firstName: userData.firstName,
            lastName: userData.lastName, image: userData.image,
            token: userData.token,
          },
          userData.token
        );
      }
    } catch { /* fallback to NextAuth session */ }

    const result = await signIn("credentials", {
      username, password, redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid username or password. Try: emilys / emilyspass");
    } else {
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #DDD6FE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{
        position: "fixed", top: -100, right: -100, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "fixed", bottom: -80, left: -80, width: 350, height: 350,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
        pointerEvents: "none",
      }} />

      <Card sx={{ maxWidth: 440, width: "100%", p: { xs: 1, sm: 2 }, position: "relative" }}>
        <CardContent>
          {/* Logo / Brand */}
          <Stack alignItems="center" spacing={1} mb={4}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: 3,
                background: "linear-gradient(135deg, #1A56DB, #7E3AF2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 20px rgba(26,86,219,0.3)",
              }}
            >
              <SchoolOutlined sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">
              Help Study Abroad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin Dashboard — Sign in to continue
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !username || !password}
                size="large"
                sx={{ py: 1.5, fontSize: "1rem" }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
              </Button>
            </Stack>
          </Box>

          <Box mt={3} p={2} sx={{ background: "#F0F4FF", borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={600}>
              Demo credentials:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip label="emilys" size="small" onClick={() => setUsername("emilys")} clickable />
              <Chip label="emilyspass" size="small" onClick={() => setPassword("emilyspass")} clickable />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
