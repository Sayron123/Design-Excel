// Individual models for the categories that have a type filter. Codes and photos are the client's
// own, from the type pages on design-excellence.ph (/products/<type>/), copied into
// public/products/models/<type>/. Up to eight models per type; the client's site has more.

export type ProductModel = {
  code: string;
  /** Matches a name in the category's `types` list. */
  type: string;
  src: string;
  alt: string;
  /** "contain" for cut-outs on white, "cover" for room shots. */
  fit: "contain" | "cover";
};

/** URL-safe form of a type name, used in "#type-<slug>" links to the filter. */
export function typeSlug(type: string) {
  return type.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function model(folder: string, type: string, code: string, alt: string, fit: "contain" | "cover" = "contain"): ProductModel {
  const file = code.toLowerCase().replaceAll("/", "-");
  return { code, type, src: `/products/models/${folder}/${file}.jpg`, alt, fit };
}

export const MODELS: Record<string, ProductModel[]> = {
  tables: [
    model("executive-table", "Executive table", "EXT-8181", "Grey and oak executive desk with a side return"),
    model("executive-table", "Executive table", "EXT-3201", "Walnut executive desk with a long credenza"),
    model("executive-table", "Executive table", "EXT-50-2B", "White and oak L-shaped executive desk"),
    model("executive-table", "Executive table", "EXT-89-2", "Walnut-top desk on white legs with a grey cabinet"),
    model("executive-table", "Executive table", "EXT-07", "Dark grey executive desk with a curved side panel"),
    model("executive-table", "Executive table", "EXT-822", "Curved cherry executive desk with a metal modesty panel"),
    model("executive-table", "Executive table", "EXT-91-2B2", "Dark walnut desk on angled white legs with a return"),
    model("executive-table", "Executive table", "EXT-99-42", "White and oak executive suite with wall storage"),
    model("wood-executive-table", "Wood executive table", "WET-0Z13EX03B", "L-shaped walnut and charcoal executive desk"),
    model("wood-executive-table", "Wood executive table", "WET-0Z13EX03A", "Walnut and charcoal executive desk with an open return"),
    model("wood-executive-table", "Wood executive table", "WET-0Z1121", "Mahogany desk with a drawer pedestal"),
    model("wood-executive-table", "Wood executive table", "WET-0Z1120", "L-shaped mahogany desk with drawers"),
    model("wood-executive-table", "Wood executive table", "WET-0ZMT01", "Large curved executive desk in a private office", "cover"),
    model("wood-executive-table", "Wood executive table", "WET-0ZEX01", "Charcoal and walnut executive desk in an office", "cover"),
    model("conference-table", "Conference table", "CRT-97-5", "Long oak conference table with mesh chairs", "cover"),
    model("conference-table", "Conference table", "CRT-82", "Walnut boardroom table with a screen at one end", "cover"),
    model("conference-table", "Conference table", "CRT-75-6", "Walnut conference table on white legs by a window", "cover"),
    model("conference-table", "Conference table", "CRT-02", "Teak-top meeting table on white legs with chairs"),
    model("conference-table", "Conference table", "0Z-MT04", "U-shaped training and conference table", "cover"),
    model("folding-table", "Folding table", "FT-01B", "Cherry flip-top folding table on castors"),
    model("folding-table", "Folding table", "FT-01A", "Maple folding table on black legs"),
    model("folding-table", "Folding table", "FT-06832", "Walnut and white flip-top training table"),
    model("folding-table", "Folding table", "FT-07", "Yellow-top folding table that nests when folded"),
    model("folding-table", "Folding table", "FT-03D", "White flip-top table with a perforated modesty panel"),
    model("free-standing-table", "Free-standing table", "FST-50-2", "Oak desk with a green modesty panel on white legs"),
    model("free-standing-table", "Free-standing table", "FST-55-2", "Walnut desk on white loop legs"),
    model("free-standing-table", "Free-standing table", "FST-ML150", "Maple L-shaped desk with a steel pedestal"),
    model("free-standing-table", "Free-standing table", "FST-150/160/180", "Steel desk with two drawer pedestals"),
    model("free-standing-table", "Free-standing table", "FST-100/120/140", "Steel desk with one drawer pedestal"),
    model("coffee-table", "Coffee table", "CF-01", "Glass coffee table on a sculpted wood base"),
    model("coffee-table", "Coffee table", "CF-2H", "Two-tier black glass coffee table"),
    model("coffee-table", "Coffee table", "CF-26", "Round white side table on wooden legs"),
    model("coffee-table", "Coffee table", "CF-24B", "Round white side table on a wire base"),
    model("coffee-table", "Coffee table", "CF-24A", "White coffee table on a wire base"),
    model("coffee-table", "Coffee table", "MT-811", "Round glass table on crossed chrome legs"),
    model("coffee-table", "Coffee table", "MT-23", "Round glass table on a chrome tulip base"),
    model("coffee-table", "Coffee table", "MT-90B", "Round maple table on a steel column"),
  ],
  chairs: [
    model("leatherette-chair", "Leatherette chair", "ELHC-141A", "Black leatherette high-back chair"),
    model("leatherette-chair", "Leatherette chair", "ELHC-888", "Dark leatherette high-back chair with a wood back"),
    model("leatherette-chair", "Leatherette chair", "ELHC-537H", "Tan leatherette high-back chair"),
    model("leatherette-chair", "Leatherette chair", "ELHC-397", "Black ribbed leatherette high-back chair"),
    model("leatherette-chair", "Leatherette chair", "ELHC-0206", "Black leatherette executive chair with chrome arms"),
    model("leatherette-chair", "Leatherette chair", "ELHC-181B", "Black leatherette reclining chair"),
    model("leatherette-chair", "Leatherette chair", "ELMSC-1706C", "Tan leatherette mid-back chair"),
    model("leatherette-chair", "Leatherette chair", "ELMC-1004", "Black leatherette mid-back chair"),
    model("mesh-chair", "Mesh chair", "VMSC-7010-D", "White frame visitor chair with a blue mesh back"),
    model("mesh-chair", "Mesh chair", "VMSC-500", "Black mesh visitor chair on a chrome sled base"),
    model("mesh-chair", "Mesh chair", "VMC-2189", "Mesh task chair with an orange seat"),
    model("mesh-chair", "Mesh chair", "VMC-933", "Dark mesh task chair"),
    model("mesh-chair", "Mesh chair", "VMC-750BEX", "Black mesh task chair"),
    model("mesh-chair", "Mesh chair", "EMC-01AM", "Black mesh high-back chair with a headrest"),
    model("mesh-chair", "Mesh chair", "EMC-108", "Black mesh high-back chair with a winged back"),
    model("mesh-chair", "Mesh chair", "EMC-2190", "Black mesh high-back chair with a headrest and chrome base"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVSC-209", "Grey fabric visitor chair on a sled base"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVC-6640", "Grey fabric task chair"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVC-5226", "Red and black fabric task chair"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVC-950", "Navy fabric mid-back chair"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVC-888", "Red fabric mid-back chair"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FVC-812TGA", "Dark grey fabric task chair with looped arms"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FMVC-208", "Grey fabric mid-back chair"),
    model("fabric-upholstered-chair", "Fabric upholstered chair", "FHVC-207", "Grey fabric high-back chair"),
    model("bar-stool", "Bar stool", "BS-019", "Black bar stool on a chrome column"),
    model("bar-stool", "Bar stool", "BS-130", "Round black stool on a chrome frame"),
    model("bar-stool", "Bar stool", "BS-132", "Square stool on a brushed steel frame"),
    model("bar-stool", "Bar stool", "BS-51", "Black drafting stool with a foot ring"),
    model("lounge-chair", "Lounge chair", "LC-1115", "Red egg lounge chair"),
    model("lounge-chair", "Lounge chair", "LC-1151", "Brown leatherette tub chair on a swivel base"),
    model("lounge-chair", "Lounge chair", "LC-1105", "Lime fabric tub chair on a star base"),
    model("lounge-chair", "Lounge chair", "LC-7121", "Sage wing-back lounge chair"),
    model("lounge-chair", "Lounge chair", "LC-7119", "Light grey fabric chair on wooden legs"),
    model("lounge-chair", "Lounge chair", "LC-7111", "Grey shell lounge chair on wooden legs"),
    model("lounge-chair", "Lounge chair", "LC-7086", "Green fabric lounge chair on wooden legs"),
    model("lounge-chair", "Lounge chair", "LC-1186", "Yellow shell chair on a chrome star base"),
    model("lounge-set", "Lounge set", "LC-05", "Black tufted leather lounge set with a glass table", "cover"),
    model("lounge-set", "Lounge set", "LC-04", "Black leather sofa set with a glass coffee table", "cover"),
    model("lounge-set", "Lounge set", "LC-3B2", "Black leather cube sofa set with a round table"),
    model("lounge-set", "Lounge set", "LC-88", "Black leather sofa set in a living room", "cover"),
    model("gang-chair", "Gang chair", "GC-YA20", "Four-seat perforated steel gang chair"),
    model("gang-chair", "Gang chair", "GC-PU", "Four-seat black leatherette gang chair"),
    model("gang-chair", "Gang chair", "GC-GSSAC5", "Five-seat perforated steel gang chair"),
    model("gang-chair", "Gang chair", "GC-900-03", "Four-seat silver gang chair"),
    model("theater-seat", "Theater seat", "TS-HJ95", "Red upholstered theater seats"),
    model("theater-seat", "Theater seat", "TS-919", "Grey theater seats with writing tablets"),
    model("theater-seat", "Theater seat", "TS-907", "Teal theater seats with writing tablets"),
    model("theater-seat", "Theater seat", "TS-712", "Teal theater seats with a wooden end panel"),
    model("theater-seat", "Theater seat", "TS-603", "Blue theater seats with a fold-out tablet"),
    model("training-chair", "Training chair", "TC-02A", "Red training chair with a black perforated back"),
  ],
};
