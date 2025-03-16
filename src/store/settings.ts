import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  cornerScheme: [string, string, string];
}

const defaultState: SettingsState = {
  cornerScheme: ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultState,
  reducers: {
    setCornersSchemeFromSpeffz: (state, action: PayloadAction<string>) => {
      const scheme = action.payload;
      // prettier-ignore
      state.cornerScheme = [
        scheme[2] + scheme[3] + scheme[0] + scheme[1] +
          scheme[21] + scheme[20] + scheme[23] + scheme[22],
        scheme[12] + scheme[8] + scheme[4] + scheme[16] +
          scheme[10] + scheme[6] + scheme[18] + scheme[14],
        scheme[9] + scheme[5] + scheme[17] + scheme[13] +
          scheme[15] + scheme[11] + scheme[7] + scheme[19],
      ];
    },
  },
});

export const { setCornersSchemeFromSpeffz } = settingsSlice.actions;
export default settingsSlice.reducer;
