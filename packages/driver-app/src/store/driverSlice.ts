import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverState, DriverUser, Location, JobUpdate, DriverJob } from '../types';

const initialState: DriverState = {
  user: {
    id: '1',
    name: 'John Smith',
    email: 'john@workero.com',
    phone: '+1234567890',
    vanId: 'van-001',
    skills: ['plumbing', 'electrical'],
  },
  currentJob: null,
  jobs: [],
  isOnline: true,
  location: null,
  clockedIn: false,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DriverUser>) => {
      state.user = action.payload;
    },
    setJobs: (state, action: PayloadAction<DriverJob[]>) => {
      state.jobs = action.payload;
    },
    setCurrentJob: (state, action: PayloadAction<DriverJob | null>) => {
      state.currentJob = action.payload;
    },
    updateJobStatus: (state, action: PayloadAction<JobUpdate>) => {
      const { jobId, status } = action.payload;
      const job = state.jobs.find(j => j.id === jobId);
      if (job) {
        job.status = status;
      }
      if (state.currentJob?.id === jobId) {
        state.currentJob.status = status;
      }
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    setClockedIn: (state, action: PayloadAction<boolean>) => {
      state.clockedIn = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.currentJob = null;
      state.jobs = [];
      state.isOnline = false;
      state.clockedIn = false;
    },
  },
});

export const {
  setUser,
  setJobs,
  setCurrentJob,
  updateJobStatus,
  setOnlineStatus,
  setLocation,
  setClockedIn,
  logout,
} = driverSlice.actions;

export default driverSlice.reducer;