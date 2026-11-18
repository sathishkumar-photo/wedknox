// LOCATION: components/admin/tabs/types.ts
import type { Dispatch, SetStateAction } from "react";
import type { Content, SectionKey } from "@/lib/content-schema";

export type Update = <K extends SectionKey>(key: K, fn: (prev: Content[K]) => Content[K]) => void;
export type TabProps = { draft: Content; update: Update; setDraft: Dispatch<SetStateAction<Content>> };