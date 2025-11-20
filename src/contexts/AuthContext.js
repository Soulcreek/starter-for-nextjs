"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Install a temporary fetch wrapper to log outgoing Appwrite requests (helps debug missing params)
    try {
      if (typeof window !== "undefined" && !window.__appwrite_fetch_logged) {
        const originalFetch = window.fetch.bind(window);
        const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";

        window.fetch = async (...args) => {
          try {
            const url = args[0];
            const options = args[1] || {};
            if (typeof url === "string" && appwriteEndpoint && url.includes(appwriteEndpoint.replace(/\/v1$/, ""))) {
              console.log("[Appwrite Fetch] ->", url);
              if (options && options.body) {
                try {
                  console.log("[Appwrite Fetch] body:", JSON.parse(options.body));
                } catch (e) {
                  console.log("[Appwrite Fetch] body (raw):", options.body);
                }
              }
            }
          } catch (e) {
            console.warn("Appwrite fetch logger error", e);
          }
          return originalFetch(...args);
        };

        window.__appwrite_fetch_logged = true;
        console.log("Appwrite fetch logger installed");
      }
    } catch (e) {
      console.warn("Could not install fetch logger", e);
    }

    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      // Ignore errors during initial check (user not logged in is expected)
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("AuthContext.login called with:", { 
        email, 
        password: password ? `[${password.length} chars]` : '[EMPTY]',
        passwordType: typeof password 
      });
      
      // SDK expects positional arguments in v18+
      await account.createEmailPasswordSession(email, password);
      
      const accountDetails = await account.get();
      setUser(accountDetails);
      console.log("Login successful!");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = error.message;
      
      // Provide helpful error messages
      if (error.code === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Connection error. Please check SETUP.md for platform configuration.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, name) => {
    try {
      // account.create also expects positional arguments
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = error.message;
      
      // Provide helpful error messages
      if (error.code === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Connection error. Please check TROUBLESHOOTING.md for platform configuration.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSessions();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
