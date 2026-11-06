import React from "react";
import { useParams } from "react-router-dom";
import LinktreeTemplateRenderer, { LINKTREE_TEMPLATES, getLinktreeTemplateNumber } from "../linktree-templates";
import useSEO from "../hooks/useSEO";

/** Public full-page demo of a Linktree template, rendered with sample data. */
export default function LinktreeTemplatePreview() {
  const { templateId } = useParams();
  const num = getLinktreeTemplateNumber(templateId);
  const tpl = LINKTREE_TEMPLATES.find((t) => t.numericId === num);

  useSEO({
    title: `${tpl?.name || "Linktree"} Link-in-Bio Template Preview | ByteBodh`,
    description: tpl?.description || "Preview a ByteBodh link-in-bio template.",
  });

  return <LinktreeTemplateRenderer templateId={num} />;
}
