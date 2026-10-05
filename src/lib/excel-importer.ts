import * as XLSX from "xlsx";
import { NeighborhoodTariff } from "./types";

/**
 * Parses an Excel (.xlsx, .xls) or CSV file and extracts neighborhood tariffs.
 * Handles flexible column naming like "Barrio", "Sector", "Zona", "Destino",
 * and "Precio", "Tarifa", "Valor", "Costo", "Domicilio", "Envío".
 */
export async function parseNeighborhoodExcel(file: File): Promise<{
  success: boolean;
  data: NeighborhoodTariff[];
  error?: string;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { success: false, data: [], error: "El archivo Excel está vacío o no contiene hojas legibles." };
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" });

    if (!rawRows || rawRows.length === 0) {
      return { success: false, data: [], error: "No se encontraron filas con datos en la primera hoja del Excel." };
    }

    // Identify Barrio and Price columns
    const firstRow = rawRows[0];
    const columnKeys = Object.keys(firstRow);

    const barrioKey = columnKeys.find((k) => {
      const lower = k.toLowerCase().trim();
      return (
        lower.includes("barrio") ||
        lower.includes("sector") ||
        lower.includes("zona") ||
        lower.includes("destino") ||
        lower.includes("lugar") ||
        lower.includes("nombre")
      );
    }) || columnKeys[0]; // fallback to first column

    const priceKey = columnKeys.find((k) => {
      const lower = k.toLowerCase().trim();
      return (
        lower.includes("precio") ||
        lower.includes("tarifa") ||
        lower.includes("valor") ||
        lower.includes("costo") ||
        lower.includes("domicilio") ||
        lower.includes("envio") ||
        lower.includes("envío")
      );
    }) || columnKeys[1]; // fallback to second column

    const parsedTariffs: NeighborhoodTariff[] = [];

    for (const row of rawRows) {
      const rawBarrio = String(row[barrioKey] || "").trim();
      const rawPrice = row[priceKey];

      if (!rawBarrio) continue;

      // Clean price: handle strings like "$4.500", "4,500", "4500 COP"
      let numericPrice = 0;
      if (typeof rawPrice === "number") {
        numericPrice = rawPrice;
      } else if (typeof rawPrice === "string") {
        const cleaned = rawPrice.replace(/[^0-9]/g, "");
        numericPrice = cleaned ? parseInt(cleaned, 10) : 0;
      }

      // If price looks like 4 or 4.5 (thousands omitted), scale it
      if (numericPrice > 0 && numericPrice < 100) {
        numericPrice = numericPrice * 1000;
      }

      if (numericPrice > 0) {
        // Standardize capitalization (Title Case)
        const formattedBarrio = rawBarrio
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");

        parsedTariffs.push({
          barrio: formattedBarrio,
          precio: numericPrice,
        });
      }
    }

    if (parsedTariffs.length === 0) {
      return {
        success: false,
        data: [],
        error: `No se pudieron extraer tarifas válidas. Verifica que las columnas se llamen "Barrio" y "Valor" o "Precio". Detectamos: [${columnKeys.join(", ")}]`,
      };
    }

    // Sort alphabetically by neighborhood name
    parsedTariffs.sort((a, b) => a.barrio.localeCompare(b.barrio));

    return {
      success: true,
      data: parsedTariffs,
    };
  } catch (err: any) {
    console.error("Error parsing Excel:", err);
    return {
      success: false,
      data: [],
      error: err.message || "Error al procesar el archivo Excel. Verifica el formato.",
    };
  }
}

/**
 * Exports current neighborhood tariffs to a downloadable Excel file template
 */
export function exportTariffsToExcel(tariffs: NeighborhoodTariff[]): void {
  const wsData = tariffs.map((t) => ({
    Barrio: t.barrio,
    "Tarifa Domicilio ($ COP)": t.precio,
  }));

  const worksheet = XLSX.utils.json_to_sheet(wsData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tarifas Pasto");

  XLSX.writeFile(workbook, "Tarifas_Domicilios_Rincon_Dulce_Pasto.xlsx");
}
