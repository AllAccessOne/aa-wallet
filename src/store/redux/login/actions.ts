import { createAsyncThunk } from "@reduxjs/toolkit";

export const setCurrentListTokens = createAsyncThunk<any, object>("set/current_list_tokens", async (listTokens: object, { fulfillWithValue }) => {
  return fulfillWithValue(listTokens);
});
