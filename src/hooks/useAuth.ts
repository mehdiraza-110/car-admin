import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  email: string;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoginError(null);
      return apiRequest("POST", "/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Login failed. Please try again.";
      setLoginError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const register = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      setRegisterError(null);
      return apiRequest("POST", "/api/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Registration failed. Please try again.";
      setRegisterError(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.clear();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    login,
    loginError,
    register,
    registerError,
    logout,
  };
}