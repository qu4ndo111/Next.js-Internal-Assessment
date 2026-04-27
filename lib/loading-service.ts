
type LoadingState = {
  isLoading: boolean;
  message: string | null;
  requestCount: number;
};

const state: LoadingState = {
  isLoading: false,
  message: null,
  requestCount: 0,
};

const listeners = new Set<(state: LoadingState) => void>();

const emit = () => {
  listeners.forEach((fn) => fn(state));
};

export const loadingService = {
  show(message: string = "Đang xử lý...") {
    state.requestCount++;
    state.isLoading = true;
    state.message = message;
    emit();
  },
  hide() {
    state.requestCount--;
    if (state.requestCount <= 0) {
      state.requestCount = 0;
      state.isLoading = false;
      state.message = null;
    }
    emit();
  },
  subscribe(fn: (state: LoadingState) => void) {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
  },
  getState() {
    return state;
  }
};
