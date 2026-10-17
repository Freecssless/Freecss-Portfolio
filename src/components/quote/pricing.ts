/**
 * Prices and what each level includes. Edit here to change the quote calculator.
 */

export type FormatId = "vertical" | "horizontal";

export type Tier = {
  id: "basico" | "intermedio" | "complejo";
  name: string;
  /** USD per piece (vertical) or per 10 minutes (horizontal) */
  price: number;
  /** new items on top of the previous level ("Todo lo anterior") */
  features: string[];
};

export type Format = {
  id: FormatId;
  label: string;
  ratio: string;
  /** shown after the price, e.g. "/ Pieza" */
  per: string;
  tiers: Tier[];
  amount: {
    label: string;
    min: number;
    max: number;
    step: number;
    initial: number;
    /** "3 videos", "25 minutos" */
    format: (n: number) => string;
    /** ticks shown under the slider */
    ticks: number[];
  };
  /** subtotal before the priority surcharge */
  subtotal: (tierPrice: number, amount: number) => number;
};

export const PRIORITY_SURCHARGE = 0.3;

export const FORMATS: Record<FormatId, Format> = {
  vertical: {
    id: "vertical",
    label: "Vertical",
    ratio: "9:16",
    per: "/ Pieza",
    tiers: [
      {
        id: "basico",
        name: "Básico",
        price: 15,
        features: ["Recortes limpios", "Zooms funcionales", "Subtítulos", "Diseño sonoro"],
      },
      { id: "intermedio", name: "Intermedio", price: 25, features: ["Efectos visuales", "Corrección de color"] },
      { id: "complejo", name: "Complejo", price: 55, features: ["Motion Graphics", "Recursos 3D", "Rotoscopía"] },
    ],
    amount: {
      label: "Cantidad de piezas",
      min: 1,
      max: 10,
      step: 1,
      initial: 1,
      format: (n) => `${n} ${n === 1 ? "video" : "videos"}`,
      ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    subtotal: (price, pieces) => price * pieces,
  },
  horizontal: {
    id: "horizontal",
    label: "Horizontal",
    ratio: "16:9",
    per: "/ 10 min",
    tiers: [
      { id: "basico", name: "Básico", price: 50, features: ["Recortes limpios", "Zooms funcionales", "Subtítulos"] },
      { id: "intermedio", name: "Intermedio", price: 70, features: ["Diseño sonoro", "Efectos visuales"] },
      {
        id: "complejo",
        name: "Complejo",
        price: 120,
        features: ["Corrección de color", "Motion Graphics", "Recursos 3D", "Rotoscopía"],
      },
    ],
    amount: {
      label: "Duración del video",
      min: 5,
      max: 60,
      step: 1,
      initial: 10,
      format: (n) => `${n} ${n === 1 ? "minuto" : "minutos"}`,
      ticks: [5, 10, 20, 30, 40, 50, 60],
    },
    // the rate is per 10 minutes, charged proportionally to the duration
    subtotal: (price, minutes) => (price * minutes) / 10,
  },
};

/** every feature included up to (and including) a level */
export const includedFeatures = (format: Format, tierIndex: number) =>
  format.tiers.slice(0, tierIndex + 1).flatMap((t) => t.features);

export const GUARANTEES = ["Una ronda de ajustes", "Exportación final"];
export const DISCLAIMER = "Los requerimientos fuera de alcance pueden modificar la cotización final";

export const formatUSD = (n: number) => {
  const whole = Math.abs(n - Math.round(n)) < 0.005;
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })}`;
};
