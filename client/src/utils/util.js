const sheetID = "1Epj2rNmTpauqLFcEIjmyT3aEE4N3pb9Q5ckhxGSbv30";
export const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

export const defaultCols = {
   itemId: {
      visibility: 0,
      hunName: "ID",
      required: true,
   },
   name: {
      visibility: 1,
      hunName: "megnevezés",
      required: true,
   },
   quantity: {
      visibility: 1,
      hunName: "mennyiség",
      required: true,
   },
   place: {
      visibility: 1,
      hunName: "hely",
      required: true,
   },
   status: {
      visibility: 1,
      hunName: "állapot",
      required: true,
   },
   ownerIsKK: {
      visibility: 0,
      hunName: "kk tulajdon",
      required: false,
   },
   responsibilityLevel: {
      visibility: 0,
      hunName: "felelősségi szint",
      required: false,
   },
   getInYear: {
      visibility: 0,
      hunName: "beszerzés éve",
      required: false,
   },
   inventoryNr: {
      visibility: 1,
      hunName: "leltári azonosító",
      required: false,
   },
   getFrom: {
      visibility: 0,
      hunName: "beszerzés helye",
      required: false,
   },
   value: {
      visibility: 0,
      hunName: "beszerzési érték",
      required: false,
   },
   description: {
      visibility: 1,
      hunName: "megjegyzés",
      required: false,
   },
   responsibleUser: {
      visibility: 0,
      hunName: "felelős (teljes név)",
      required: true,
   },
   shortName: {
      visibility: 1,
      hunName: "felelős (rövid)",
      required: true,
   },
   userName: {
      visibility: 0,
      hunName: "felelős (teljes)",
      required: true,
   },
};

export const translateLabel = (field) => {
   if ([field] in defaultCols) {
      let hunName = defaultCols[field]["hunName"];
      return hunName.charAt(0).toUpperCase() + hunName.slice(1);
   }
   return field;
}

export const propsDisplayInSelect = [
   "status",
   "place",
   "responsibleUser",
   "ownerIsKK",
   "responsibilityLevel"
];