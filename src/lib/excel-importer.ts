import * as XLSX from "xlsx";
import { NeighborhoodTariff } from "./types";

/**
 * Parses an Excel (.xlsx, .xls) or CSV file and extracts neighborhood tariffs.
 * - Inspects all sheets in the workbook (e.g., 'Barrios', 'Tarifas', etc.).
 * - Automatically finds the table header even if there are titles, banners or empty rows above it.
 * - Handles flexible column names ("Barrio", "Sector", "Zona", "Destino", "Tarifa", "Precio", "Valor", etc.).
 * - Ignores restricted or unavailable neighborhoods (e.g., "Restringido = Sí", "No disponible").
 */
export async function parseNeighborhoodExcel(file: File): Promise<{
  success: boolean;
  data: NeighborhoodTariff[];
  sheetName?: string;
  error?: string;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { success: false, data: [], error: "El archivo Excel está vacío o no contiene hojas legibles." };
    }

    let bestTariffs: NeighborhoodTariff[] = [];
    let bestSheetName = "";
    let detectedHeadersAcrossSheets: string[] = [];

    // Prioritize sheets named 'barrios', 'tarifas', 'domicilios', 'envios', etc.
    const sortedSheetNames = [...workbook.SheetNames].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const score = (name: string) => {
        if (name === "barrios") return 10;
        if (name === "tarifas") return 8;
        if (name.includes("barrio")) return 6;
        if (name.includes("tarifa")) return 5;
        if (name.includes("buscar")) return -1; // Helper sheets usually come last
        return 0;
      };
      return score(bLower) - score(aLower);
    });

    for (const sheetName of sortedSheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const raw2D = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: "" });
      if (!raw2D || raw2D.length === 0) continue;

      // Scan first 30 rows looking for header row
      let headerRowIdx = -1;
      let barrioCol = -1;
      let priceCol = -1;
      let restrictedCol = -1;

      for (let r = 0; r < Math.min(raw2D.length, 30); r++) {
        const row = raw2D[r];
        if (!Array.isArray(row) || row.length === 0) continue;

        let bCol = -1;
        let pCol = -1;
        let rCol = -1;

        row.forEach((cell, idx) => {
          const val = String(cell || "").toLowerCase().trim();
          if (!val) return;

          // Check for neighborhood column
          if (
            /barrio|sector|destino|lugar/.test(val) ||
            val === "nombre" ||
            val === "zona"
          ) {
            bCol = idx;
          }
          // Check for price/tariff column
          if (/tarifa|precio|valor|costo|domicilio|envio|envío/.test(val)) {
            pCol = idx;
          }
          // Check for restriction column
          if (/restringid|bloquead|disponible/.test(val)) {
            rCol = idx;
          }
        });

        if (bCol !== -1 && pCol !== -1 && bCol !== pCol) {
          headerRowIdx = r;
          barrioCol = bCol;
          priceCol = pCol;
          restrictedCol = rCol;
          break;
        }
      }

      // If no explicit header was found, try a 2-column fallback for simple sheets
      if (headerRowIdx === -1) {
        // Fallback: check if row 0 has at least 2 columns
        const row0 = raw2D[0];
        if (Array.isArray(row0) && row0.length >= 2) {
          const b0 = String(row0[0] || "").toLowerCase();
          const p0 = String(row0[1] || "").toLowerCase();
          if (
            b0.includes("barrio") ||
            b0.includes("nombre") ||
            p0.includes("precio") ||
            p0.includes("tarifa") ||
            p0.includes("valor")
          ) {
            headerRowIdx = 0;
            barrioCol = 0;
            priceCol = 1;
          }
        }
      }

      if (headerRowIdx === -1) {
        // Collect detected headers in this sheet for debugging message if all fail
        const candidateRow = raw2D.find((r) => Array.isArray(r) && r.some((c) => String(c).trim().length > 0));
        if (candidateRow) {
          detectedHeadersAcrossSheets.push(
            `[${sheetName}: ${candidateRow.slice(0, 5).map((c) => String(c).trim()).filter(Boolean).join(", ")}]`
          );
        }
        continue;
      }

      const currentTariffs: NeighborhoodTariff[] = [];
      const seenBarrios = new Set<string>();

      for (let r = headerRowIdx + 1; r < raw2D.length; r++) {
        const row = raw2D[r];
        if (!Array.isArray(row) || row.length === 0) continue;

        const rawBarrio = String(row[barrioCol] || "").trim();
        const rawPrice = row[priceCol];
        const rawRestricted =
          restrictedCol !== -1 ? String(row[restrictedCol] || "").trim().toLowerCase() : "";

        if (!rawBarrio) continue;

        // Skip restricted neighborhoods (marked as Sí/Si or with "No disponible")
        if (
          rawRestricted === "si" ||
          rawRestricted === "sí" ||
          rawRestricted === "true" ||
          rawRestricted === "1"
        ) {
          continue;
        }

        const priceStr = String(rawPrice || "").toLowerCase();
        if (
          priceStr.includes("no disponible") ||
          priceStr.includes("restringido") ||
          priceStr.includes("bloqueado")
        ) {
          continue;
        }

        // Clean numeric price
        let numericPrice = 0;
        if (typeof rawPrice === "number") {
          numericPrice = Math.round(rawPrice);
        } else if (typeof rawPrice === "string") {
          const cleaned = rawPrice.replace(/[^0-9]/g, "");
          numericPrice = cleaned ? parseInt(cleaned, 10) : 0;
        }

        // If price is written in thousands without zeros (e.g. 6 or 6.5 -> 6000 or 6500)
        if (numericPrice > 0 && numericPrice < 100) {
          numericPrice = numericPrice * 1000;
        }

        if (numericPrice > 0) {
          const normalizedKey = rawBarrio.toLowerCase();
          if (!seenBarrios.has(normalizedKey)) {
            seenBarrios.add(normalizedKey);

            // Clean barrio name capitalization
            const formattedBarrio = rawBarrio
              .split(" ")
              .map((w) => {
                if (w.length <= 2 && /^(de|del|la|las|los|el|y|en)$/i.test(w)) {
                  return w.toLowerCase();
                }
                return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
              })
              .join(" ");

            currentTariffs.push({
              barrio: formattedBarrio,
              precio: numericPrice,
            });
          }
        }
      }

      // If this sheet has more valid tariffs than our previous best, take it
      if (currentTariffs.length > bestTariffs.length) {
        bestTariffs = currentTariffs;
        bestSheetName = sheetName;
      }
    }

    if (bestTariffs.length === 0) {
      return {
        success: false,
        data: [],
        error: `No se pudieron extraer tarifas válidas. Verifica que el archivo tenga columnas de Barrio y Tarifa/Precio. Se examinaron las hojas: ${detectedHeadersAcrossSheets.join(" ")}`,
      };
    }

    // Sort alphabetically by neighborhood name
    bestTariffs.sort((a, b) => a.barrio.localeCompare(b.barrio));

    return {
      success: true,
      data: bestTariffs,
      sheetName: bestSheetName,
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
