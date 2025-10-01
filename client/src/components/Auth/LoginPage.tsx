import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Dashboard } from "@mui/icons-material";

interface LoginPageProps {
  onLogin?: (username: string, password: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (username === "admin" && password === "admin") {
        if (onLogin) {
          await onLogin(username, password);
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: { xs: "95%", sm: "400px", md: "450px" },
            maxWidth: "500px",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Dashboard sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: 600,
                textAlign: "center",
                color: "text.primary",
              }}
            >
              Number Management System
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, textAlign: "center" }}
            >
              Sign in to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem", fontWeight: 500 }}
              disabled={loading || !username || !password}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "info.lighter",
                border: "1px solid",
                borderColor: "info.light",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                color="info.dark"
                sx={{ textAlign: "center" }}
              >
                <strong>Demo Credentials:</strong> Username: admin | Password:
                admin
              </Typography>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: "absolute", bottom: 20, textAlign: "center" }}
        >
          © 2025 Number Management System. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
