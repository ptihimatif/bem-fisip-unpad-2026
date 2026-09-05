import { type SchemaTypeDefinition } from "sanity";
import { postType } from "./postType";
import { mapres } from "./mapres";
import { siteSettings } from "./siteSettings";
import { cabinetProfile } from "./cabinetProfile";
import { program } from "./program";
import { organizationUnit } from "./organizationUnit";
import { member } from "./member";
import { studentAssociation } from "./studentAssociation";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    mapres,
    siteSettings,
    cabinetProfile,
    program,
    organizationUnit,
    member,
    studentAssociation
  ]
};
