"use client";

import { Container } from "@/components/common/container";

function Toolbar({ children }) {
  return (
    <div className="pb-5">
      <Container className="flex items-center justify-between flex-wrap gap-3">
        {children}
      </Container>
    </div>
  );
}

function ToolbarHeading({ title = "Dashboard" }) {
  return <h1 className="font-medium text-base text-mono">{title}</h1>;
}

export { Toolbar, ToolbarHeading };
