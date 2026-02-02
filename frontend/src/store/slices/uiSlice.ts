import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UiState {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedTaskId: number | null;
  notification: Notification | null;
}

const initialState: UiState = {
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isViewModalOpen: false,
  isDeleteDialogOpen: false,
  selectedTaskId: null,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openEditModal: (state, action: PayloadAction<number>) => {
      state.isEditModalOpen = true;
      state.selectedTaskId = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedTaskId = null;
    },
    openViewModal: (state, action: PayloadAction<number>) => {
      state.isViewModalOpen = true;
      state.selectedTaskId = action.payload;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedTaskId = null;
    },
    openDeleteDialog: (state, action: PayloadAction<number>) => {
      state.isDeleteDialogOpen = true;
      state.selectedTaskId = action.payload;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.selectedTaskId = null;
    },
    showNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openViewModal,
  closeViewModal,
  openDeleteDialog,
  closeDeleteDialog,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
