import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, AssessmentStatus } from '@/src/types/assessment';

interface AssessmentsState {
  items: Assessment[];
  currentAssessment: Assessment | null;
  loading: boolean;
}

const initialState: AssessmentsState = {
  items: [],
  currentAssessment: null,
  loading: false,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    addAssessment: (state, action: PayloadAction<Assessment>) => {
      state.items.unshift(action.payload);
    },
    updateAssessmentStatus: (state, action: PayloadAction<{ id: string, status: AssessmentStatus, updateMessage?: string }>) => {
      const { id, status, updateMessage } = action.payload;
      
      const updateData = (assessment: Assessment) => {
        assessment.status = status;
        if (status === "REJECTED") {
          assessment.rejectionReason = updateMessage || "";
          assessment.reviewNote = undefined;
        } else {
          assessment.reviewNote = updateMessage;
          assessment.rejectionReason = null;
        }

        if (["APPROVED", "REJECTED", "PARTIALLY_APPROVED"].includes(status)) {
          const now = new Date();
          assessment.completedAt = now.toISOString();
          
          const submittedAt = new Date(assessment.submittedAt);
          const diffTime = Math.abs(now.getTime() - submittedAt.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          assessment.processingDays = diffDays;
          assessment.assessedAmount = assessment.claimedAmount;
        } else {
          assessment.completedAt = null;
          assessment.processingDays = null;
        }
      };

      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        updateData(state.items[index]);
      }

      if (state.currentAssessment && state.currentAssessment.id === id) {
        updateData(state.currentAssessment);
      }
    },
    setAssessments: (state, action: PayloadAction<Assessment[]>) => {
      state.items = action.payload;
    },
    setCurrentAssessment: (state, action: PayloadAction<Assessment>) => {
      state.currentAssessment = action.payload;
    }
  },
});

export const { addAssessment, updateAssessmentStatus, setAssessments, setCurrentAssessment } = assessmentsSlice.actions;
export default assessmentsSlice.reducer;
