"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface ServiceNavItem {
  name: string;
  slug: string;
}

const ServicesContext = createContext<ServiceNavItem[]>([]);

export function ServicesProvider({
  services,
  children,
}: {
  services: ServiceNavItem[];
  children: ReactNode;
}) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
