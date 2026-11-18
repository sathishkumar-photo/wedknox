// LOCATION: components/admin/context.tsx
"use client";
import { createContext, useContext } from "react";

export type UploadConfig = { url: string; anonKey: string };
type Ctx = { upload: UploadConfig | null; toast: (type: "ok" | "error", text: string) => void };

export const AdminContext = createContext<Ctx>({ upload: null, toast: () => {} });
export const useAdmin = () => useContext(AdminContext);