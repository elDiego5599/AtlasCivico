import { DEPARTMENTS } from "../data/departments";

export function normalizeDeptName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const DEPT_LOOKUP = {};
DEPARTMENTS.forEach((d) => {
  DEPT_LOOKUP[normalizeDeptName(d.name)] = d;
});
DEPT_LOOKUP[normalizeDeptName("BOGOTÁ, D.C.")] = DEPARTMENTS.find(
  (d) => d.id === "cundinamarca"
);
DEPT_LOOKUP[
  normalizeDeptName("ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA")
] = DEPARTMENTS.find((d) => d.id === "san_andres");

export function findDepartment(toponame) {
  return DEPT_LOOKUP[normalizeDeptName(toponame)] || null;
}
