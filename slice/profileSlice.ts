import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✳️ نوع‌دهی به داده‌های پروفایل
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  weight: string;
  height: string;
  fitnessGoal: string;
}

// ✳️ وضعیت کلی state
interface ProfileState {
  formData: ProfileData;
  isEditing: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

// ✳️ مقدار اولیه
const initialState: ProfileState = {
  formData: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    fitnessGoal: "Build Muscle",
  },
  isEditing: false,
  status: "idle",
};

// ✳️ thunk برای دریافت پروفایل
export const fetchProfile = createAsyncThunk<ProfileData>(
  "profile/fetchProfile",
  async () => {
    const res = await fetch("/api/profile/get");
    if (!res.ok) throw new Error("Failed to load profile");
    return await res.json();
  }
);

// ✳️ thunk برای به‌روزرسانی پروفایل
export const updateProfile = createAsyncThunk<ProfileData, ProfileData>(
  "profile/updateProfile",
  async (formData) => {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  }
);

// ✳️ ساختن Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ field: keyof ProfileData; value: string }>
    ) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.formData = {
          ...initialState.formData,
          ...action.payload,
        };
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.formData = {
          ...state.formData,
          ...action.payload,
        };
        state.isEditing = false;
      });
  },
});

export const { setField, toggleEditing } = profileSlice.actions;
export default profileSlice.reducer;
