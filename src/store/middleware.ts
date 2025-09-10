import { createListenerMiddleware } from '@reduxjs/toolkit';
import { addNotification } from './slices/appSlice';
import { loginUser, registerUser, logoutUser } from './slices/authThunks';

export const listenerMiddleware = createListenerMiddleware();

// Listen to auth actions and show notifications
listenerMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        type: 'success',
        title: 'Login Successful',
        description: `Welcome back, ${action.payload.user.name}!`,
        duration: 5000,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: loginUser.rejected,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        type: 'error',
        title: 'Login Failed',
        description: action.payload as string,
        duration: 5000,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: registerUser.fulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        type: 'success',
        title: 'Registration Successful',
        description: `Welcome, ${action.payload.user.name}! Your account has been created.`,
        duration: 5000,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: registerUser.rejected,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        description: action.payload as string,
        duration: 5000,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: logoutUser.fulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      addNotification({
        type: 'info',
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        duration: 3000,
      })
    );
  },
});
